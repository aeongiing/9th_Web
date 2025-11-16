import { type Comment } from "../../types/comment";

interface Props {
  data: Comment[];
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  refObserver: (node?: Element | null) => void;
}

const LpComments = ({
  data,
  isFetchingNextPage,
  fetchNextPage,
  refObserver,
}: Props) => {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">댓글</h2>
      <div className="space-y-4">
        {data.length > 0 ? (
          data.map((comment) => (
            <div key={comment.id} className="border-b pb-2">
              <p className="text-sm font-semibold">{comment.author.name}</p>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
              <p className="text-xs text-gray-400">
                {new Date(comment.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-400">아직 댓글이 없습니다.</p>
        )}
      </div>

      <div ref={refObserver} className="h-10" />
    </section>
  );
};

export default LpComments;