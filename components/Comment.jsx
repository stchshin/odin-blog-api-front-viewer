import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Comment({comment, postId, getComments}) {
    const [isEditing, setIsEditing] = useState(false);
    const [commentAuthor, setCommentAuthor] = useState(comment.author);
    const [commentContent, setCommentContent] = useState(comment.content);
    const [commentPassword, setCommentPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [isDeleting, setIsDeleting] = useState(false);

    function originalComment() {
        setIsEditing(false);
        setCommentAuthor(comment.author);
        setCommentContent(comment.content);
        setCommentPassword('');
        setErrors([]);
        setIsDeleting(false);
    }

    function handleEdit() {
        setIsEditing(true);
    }

    function handleBlur(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            originalComment();
        }
    }

    function handleComment(e) {
        setCommentContent(e.target.value);
    }

    function handleCommentAuthor(e) {
        setCommentAuthor(e.target.value);
    }

    function handleCommentPassword(e) {
        setCommentPassword(e.target.value);
    }

    function handleDeleteStart() {
        setIsDeleting(true);
    }

    async function handleDelete(e) {
        e.preventDefault();

        try {
            const response = await axiosInstance.delete(
                `/posts/${postId}/comments/${comment.id}`,
                {
                    data: { password: commentPassword }
                }
            )
            if (response.status == 204) {
                getComments();
                originalComment();
            }
        } catch (error) {
            console.log(error.response.data);
            setErrors(error.response.data.errors);
        }
    }

    async function handleForm(e) {
        e.preventDefault();

        try {
            const response = await axiosInstance.put(
                `/posts/${postId}/comments/${comment.id}`,
                {
                    content: commentContent,
                    author: commentAuthor,
                    password: commentPassword
                }
            )

            if (response.status == 200) {
                getComments();
                originalComment();
            }
        } catch (error) {
            console.log(error);
            setErrors(error.response.data.errors);
        }
    }

    if (isEditing) {
        return (
            <div>
                <form onBlur={handleBlur} onSubmit={handleForm}>
                    <div>
                        <label htmlFor="author">
                            Name
                            <input autoFocus onChange={handleCommentAuthor} id='author' value={commentAuthor} type="text" />
                        </label>
                        <label htmlFor="password">
                            Password
                            <input onChange={handleCommentPassword} id='password' value={commentPassword} type="password" />
                        </label>
                    </div>
                    
                    <input onChange={handleComment} value={commentContent} type="text" />
                    <button>Edit</button>
                </form>
                <div>
                    {errors.map((error) => {
                        return (
                            <p>{error.msg}</p>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className='commentInfo'>
                <p>{comment.author}</p>
                <p>{comment.createdAt?.split('T')[0]}</p>
                <button onClick={handleEdit}>Edit</button>
                { isDeleting ? '' : <button onClick={handleDeleteStart}>Delete</button> }
            </div>
            {comment.content}
            {
                isDeleting ?
                <div>
                    <form onSubmit={handleDelete} onBlur={handleBlur}>
                        <label htmlFor="password">
                            Password
                            <input autoFocus id="password" onChange={handleCommentPassword} value={commentPassword} type="password" />
                        </label>
                        <button>Delete</button>
                    </form>
                    <div>
                        {errors.map((error) => {
                            return (
                                <p>{error.msg}</p>
                            )
                        })}
                    </div>
                </div> :
                ''
            }
        </div>
    )
}