import './MainPage.css'
import { Link, useNavigate } from 'react-router'
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function MainPage() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPosts() {
            try {
                const response = await axiosInstance.get(
                    '/posts',
                )

                setPosts(response.data);
            } catch (error) {
                console.log(error.response.data);
            }
        }

        getPosts();
    }, [])

    function handleManage(id) {
        navigate(`/manage/${id}`)
    }

    return (
        <div className='main'>
            <h1>All Posts</h1>
            <div>
                <div className='posts'>
                    {
                        posts.map((post) => {
                            const index = posts.indexOf(post);
                            return (
                                <div className='post' style={index <= 3 ? {paddingLeft: `${index * 5}rem`} : {paddingLeft: '20rem'} } key={post.id}>
                                    <Link to={`/posts/${post.id}`}>{post.title}<span> ({post.comments.length})</span></Link> {post.createdAt.split('T')[0]}
                                    {index <= 3 && (
                                         <div>{post.content}</div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}