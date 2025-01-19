import React, { useState, useEffect } from "react";
import "./CommentsModal.css";
import { Post } from "../../../services/posts-service.ts";
import { createComment, getCommentsByPostId } from "../../../services/comments-service.ts";
import { Comment } from "../../../services/comments-service.ts";
import { useAppContext } from "../../../contexts/AppContext.ts";

interface CommentsModalProps {
  open: boolean;
  onClose: () => void;
  post: Post;
}

const CommentsModal: React.FC<CommentsModalProps> = ({
  open,
  onClose,
  post,
}) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { setSnackbar, user } = useAppContext();

  useEffect(() => {
    if (open) {
      const fetchComments = async () => {
        try {
          const fetchedComments = await getCommentsByPostId(post._id);
          setComments(fetchedComments);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };

      fetchComments();
    }
  }, [open, post._id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await createComment(post._id, newComment.trim(), user.id);
      setComments([
        ...comments,
        {
          ...comment,
          user: {
            _id: user.id,
            username: user.name,
            profilePicture: user.profilePicture,
          },
        },
      ]);
      setSnackbar({
        message: "Comment added successfully",
        type: "success",
        open: true,
      });
      setNewComment("");
    } catch (error) {
      setSnackbar({
        message: "Failed adding comment",
        type: "error",
        open: true,
      });
    }
  };

  if (!open) return null;

  return (
    <div className="comments-modal-overlay" onClick={onClose}>
      <div
        className="comments-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="comments-modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="comments-modal-content">
          {/* Post Details Section */}
          <div className="comments-modal-left">
            <img
              src={`http://localhost:3002/${post.picture.replace(/\\/g, "/")}`}
              alt={post.title}
              className="comments-modal-post-image"
            />
            <h3 className="comments-modal-post-title">{post.title}</h3>
            <p className="comments-modal-post-content">{post.content}</p>
            <p className="comments-modal-post-sender">
              By {post.sender.username} - {post.sender.phoneNumber}
            </p>
            <p className="comments-modal-post-date">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Comments Section */}
          <div className="comments-modal-right">
            <h3 className="comments-modal-comments-title">Comments</h3>
            <div className="comments-modal-comments-list">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <React.Fragment key={index}>
                    <div className="comments-modal-comment">
                      <img
                        src={`http://localhost:3002/${comment.user.profilePicture}`}
                        alt={`${comment.user.username}'s profile`}
                        className="comments-modal-comment-avatar"
                      />
                      <div className="comments-modal-comment-content">
                        <p className="comments-modal-comment-user">
                          {comment.user.username}
                        </p>
                        <p className="comments-modal-comment-message">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                    {index < comments.length - 1 && (
                      <hr className="comments-modal-divider" />
                    )}
                  </React.Fragment>
                ))
              ) : (
                <p className="comments-modal-no-comments">No comments yet.</p>
              )}
            </div>

            <div className="comments-modal-add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="comments-modal-comment-input"
              ></textarea>
              <button
                className="comments-modal-add-comment-button"
                onClick={handleAddComment}
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsModal;
