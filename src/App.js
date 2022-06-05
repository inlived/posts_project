import React, {useState, useEffect} from 'react';
import './styles/App.css';
import {usePosts} from "./hooks/usePost";
import PostService from "./API/PostService";
import {getPageCount} from "./utils/pages";
import {useFetching} from "./hooks/useFetching";
import MyButton from "./components/UI/button/MyButton";
import PostForm from "./components/PostForm";
import MyModal from "./components/UI/modal/MyModal";
import PostFilter from "./components/PostFilter";
import MyPagination from "./components/UI/pagination/MyPagination";
import PostList from "./components/PostList";
import MyLoader from "./components/UI/loader/MyLoader";



function App() {
    const [posts, setPosts] = useState([])
    const [filter, setFilter] = useState({sort:'', query: ''})
    const [modal, setModal] = useState(false);
    const SortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);

    const [fetchPosts, isPostLoading, postError] = useFetching(async () =>{
        const response = await PostService.getAll(limit, page);
        setPosts(response.data);
        const totalCount = response.headers['x-total-count']
        setTotalPages(getPageCount(totalCount, limit))
    })

    useEffect(() =>{
        fetchPosts()
    }, [page])

    const createPost = (newPost) =>{
        setPosts([...posts, newPost])
        setModal(false)
    }

    const removePost = (post) =>{
        setPosts((posts.filter(p=> p.id !== post.id)))
    }

    const changePage = (page) =>{
        setPage(page)
    }

    return (
        <div className="App">
            <MyButton style ={{marginTop: 30}} onClick={() => setModal(true)}>
                Add reason
            </MyButton>
            <MyModal visible={modal} setVisible={setModal}>
                <PostForm create={createPost}/>
            </MyModal>
            <hr style={{margin: '15px'}}/>
            <PostFilter
                filter={filter}
                setFilter={setFilter}
            />
            {postError &&
                <h1>Error {postError}</h1>
            }
            {isPostLoading
                ? <div style={{display:'flex', justifyContent: 'center', marginTop: 50}}><MyLoader/></div>
                : <PostList remove={removePost} posts={SortedAndSearchedPosts} title={'Reasons to live'}/>
            }
            <MyPagination
                page={page}
                changePage={changePage}
                totalPages={totalPages}
            />
        </div>
    );
}

export default App;















