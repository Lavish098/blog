import PostEditor from "@/components/PostEditor";
import RequireAuth from "@/components/RequireAuth";

export default function NewPostPage() {
  return (
    <RequireAuth admin>
      <PostEditor />
    </RequireAuth>
  );
}
