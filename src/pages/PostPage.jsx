import './PostPage.css'
import { Link, useNavigate, useParams } from 'react-router'
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance'
import Comment from '../../components/Comment';

export default function PostPage() {
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [newCommentAuthor, setNewCommentAuthor] = useState('');
    const [newCommentPassword, setNewCommentPassword] = useState('');
    const [newComment, setNewComment] = useState('');
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const { postId } = useParams();

    async function getComments() {
        try {
            const response = await axiosInstance.get(
                `/posts/${postId}/comments`,
            )

            setComments(response.data)
        } catch (error) {
            console.log(error.response.data);
        }  
    }

    useEffect(() => {
        async function getPost() {
            try {
                const response = await axiosInstance.get(
                    `/posts/${postId}`
                )

                setPost(response.data)
            } catch (error) {
                console.log(error.response.data);
            }
        }

        getPost();
        getComments();
    }, [postId])

    function handleComment(e) {
        setNewComment(e.target.value);
    }

    function handleCommentAuthor(e) {
        setNewCommentAuthor(e.target.value);
    }

    function handleCommentPassword(e) {
        setNewCommentPassword(e.target.value);
    }

    async function handleForm(e) {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(
                `/posts/${postId}/comments`,
                {
                    content: newComment,
                    author: newCommentAuthor,
                    password: newCommentPassword,
                    postId: postId
                }
            )

            setNewComment('');
            setNewCommentAuthor('');
            setNewCommentPassword('');
            getComments();
        } catch (error) {
            console.log(error.response.data);
            setErrors(error.response.data.errors);
        }
    }

    return (
        <div className='main'>
            <Link to="/">← Home</Link>

            <div className='postDetail'>
                <h1>{post.title}</h1>
                <div className='postInfo'>{post.author?.name} {post.createdAt?.split('T')[0]}</div>
                <div className='postContent'>
                    {post.content}
                </div>
            </div>
        
            <div className='comments'>
                <h2>Comments<span> ({comments.length})</span></h2>
                <form onSubmit={handleForm}>
                    <div>
                        <label htmlFor="author">
                            Name
                            <input onChange={handleCommentAuthor} id='author' value={newCommentAuthor} type="text" />
                        </label>
                        <label htmlFor="password">
                            Password
                            <input onChange={handleCommentPassword} id='password' value={newCommentPassword} type="password" />
                        </label>
                    </div>
                    
                    <input onChange={handleComment} value={newComment} type="text" />
                    <button>Submit</button>
                    <div>
                        {errors.map((error) => {
                            return (
                                <p>{error.msg}</p>
                            )
                        })}
                    </div>
                </form>
                { comments.length == 0 ? 'There are no comments.' :
                    comments.map((comment) => {
                    return (
                        <Comment key={comment.id} comment={comment} postId={postId} getComments={getComments} />
                    )
                })}
            </div>
        </div>
    )
}