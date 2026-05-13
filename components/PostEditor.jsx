"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bold, Heading2, ImagePlus, Italic, Link as LinkIcon, List, Quote, Save, Type } from "lucide-react";
import { createPost, updatePost, uploadPostImage } from "@/lib/posts";
import { useAuth } from "@/components/AuthProvider";

const EMPTY_DRAFT_HTML = "<h2>Start with the moment that matters.</h2><p>Write the post here. Use the toolbar above to shape the story.</p>";

function runCommand(command, value = null) {
  document.execCommand(command, false, value);
}

export default function PostEditor({ post }) {
  const router = useRouter();
  const { user } = useAuth();
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const draftKey = post ? `savblogs-edit-draft-${post.blogID}` : "savblogs-new-post-draft";
  const [title, setTitle] = useState(post?.blogTitle || "");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(post?.blogCoverPhoto || "");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [bodyHtml, setBodyHtml] = useState(post?.blogHTML || EMPTY_DRAFT_HTML);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftKey);

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setTitle(draft.title || post?.blogTitle || "");
        setCoverPreview(draft.coverPreview || post?.blogCoverPhoto || "");
        setBodyHtml(draft.bodyHtml || post?.blogHTML || EMPTY_DRAFT_HTML);
      } catch {
        setBodyHtml(post?.blogHTML || EMPTY_DRAFT_HTML);
      }
    } else {
      setTitle(post?.blogTitle || "");
      setCoverPreview(post?.blogCoverPhoto || "");
      setBodyHtml(post?.blogHTML || EMPTY_DRAFT_HTML);
    }

    setHydrated(true);
  }, [draftKey, post]);

  useEffect(() => {
    if (editorRef.current && hydrated && editorRef.current.innerHTML !== bodyHtml) {
      editorRef.current.innerHTML = bodyHtml;
    }
  }, [bodyHtml, hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const timeout = window.setTimeout(() => {
      window.localStorage.setItem(
        draftKey,
        JSON.stringify({
          title,
          bodyHtml,
          coverPreview,
          updatedAt: new Date().toISOString()
        })
      );
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [bodyHtml, coverPreview, draftKey, hydrated, title]);

  function syncBody() {
    setBodyHtml(editorRef.current?.innerHTML || "");
  }

  function chooseCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function insertImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus("Uploading image...");
    const image = await uploadPostImage(file);
    runCommand("insertImage", image.url);
    syncBody();
    setStatus("");
    event.target.value = "";
  }

  async function savePost() {
    const html = editorRef.current?.innerHTML || "";
    const plainText = editorRef.current?.innerText || "";

    if (!title.trim() || !plainText.trim()) {
      setStatus("Add a title and some body copy before publishing.");
      return;
    }

    if (!post && !coverFile) {
      setStatus("Choose a cover image before publishing.");
      return;
    }

    setSaving(true);
    setStatus(post ? "Saving changes..." : "Publishing post...");

    try {
      if (post) {
        await updatePost(post.blogID, { title: title.trim(), html, coverFile });
        window.localStorage.removeItem(draftKey);
        router.push(`/posts/${post.blogID}`);
      } else {
        const postId = await createPost({
          title: title.trim(),
          html,
          coverFile,
          profileId: user?.id || ""
        });
        window.localStorage.removeItem(draftKey);
        router.push(`/posts/${postId}`);
      }
    } catch (err) {
      setStatus(err.message || "Could not save this post.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="editor-workspace">
      <div className="editor-topbar">
        <div>
          <span className="eyebrow">{post ? "Edit post" : "New post"}</span>
          <h1>{post ? "Refine the story" : "Create a new story"}</h1>
        </div>
        <button type="button" className="button primary" onClick={savePost} disabled={saving}>
          <Save size={17} />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="editor-grid">
        <aside className="editor-sidebar">
          <label className="field">
            <span>Post title</span>
            <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter a clear headline" />
          </label>

          <label className="cover-picker">
            <input type="file" accept="image/png,image/jpeg,image/jpg" onChange={chooseCover} />
            <ImagePlus size={20} />
            <span>{coverPreview ? "Change cover image" : "Choose cover image"}</span>
          </label>

          {coverPreview && (
            <div className="cover-preview" style={{ backgroundImage: `url(${coverPreview})` }}>
              <span>Cover preview</span>
            </div>
          )}

          {status && <p className="form-status">{status}</p>}
        </aside>

        <div className="editor-surface">
          <div className="format-bar" aria-label="Formatting toolbar">
            <button type="button" onClick={() => runCommand("formatBlock", "h2")} title="Heading">
              <Heading2 size={17} />
            </button>
            <button type="button" onClick={() => runCommand("formatBlock", "p")} title="Paragraph">
              <Type size={17} />
            </button>
            <button type="button" onClick={() => runCommand("bold")} title="Bold">
              <Bold size={17} />
            </button>
            <button type="button" onClick={() => runCommand("italic")} title="Italic">
              <Italic size={17} />
            </button>
            <button type="button" onClick={() => runCommand("insertUnorderedList")} title="List">
              <List size={17} />
            </button>
            <button type="button" onClick={() => runCommand("formatBlock", "blockquote")} title="Quote">
              <Quote size={17} />
            </button>
            <button
              type="button"
              onClick={() => {
                const url = window.prompt("Paste a link");
                if (url) runCommand("createLink", url);
              }}
              title="Link"
            >
              <LinkIcon size={17} />
            </button>
            <button type="button" onClick={() => fileRef.current?.click()} title="Inline image">
              <ImagePlus size={17} />
            </button>
            <input ref={fileRef} className="hidden-input" type="file" accept="image/png,image/jpeg,image/jpg" onChange={insertImage} />
          </div>

          <div
            ref={editorRef}
            className="rich-editor"
            contentEditable
            suppressContentEditableWarning
            onInput={syncBody}
            onBlur={syncBody}
          />
        </div>
      </div>
    </section>
  );
}
