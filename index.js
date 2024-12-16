// IMPORTS
import { postsData as defaultPostsData } from "./data.js"; 
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';


// RETRIEVE STORED POST FROM LOCALSTORAGE, OR FALLBACK TO DEFAULTPOSTDATA
let postsData = JSON.parse(localStorage.getItem("postsData")) || [...defaultPostsData];


// INITIALIZATION
const postDataInput = document.getElementById('post-input')
const postBtn = document.getElementById('post-btn')


// LISTEN FOR 'INPUT' EVENT ON THE INPUT FIELD
postDataInput.addEventListener('input', function() {
    // ENABLE THE BUTTON ONLY IF THERE IS TEXT IN THE INPUT FIELD
    if (postDataInput.value.trim()) {
        postBtn.disabled = false; // ENABLE THE BUTTON
    } else {
        postBtn.disabled = true; // DISABLE THE BUTTON
    }
});



// DOCUMENT EVENTLISTENER TO CHECK IF THAT TARGETED ELEMENT IS STORED IN ITS DATA AND CALLING IT'S FUNCTION
document.addEventListener('click', function(e){
    // CHECKING IF THE LIKE, REPOST OR BOOKMARK BUTTON ON THE THE TARGET POST HAS BEEN CLICKED AND CALLING IT'S FUNCTION
    if(e.target.dataset.like){
        handleLikeClick(e.target.dataset.like)
    } else if (e.target.dataset.repost){
       handleRepostClick(e.target.dataset.repost)
    } else if(e.target.dataset.bookmark){
        handleBookmarkClick(e.target.dataset.bookmark)
    } else if(e.target.dataset.comment){
        handleReplyClick(e.target.dataset.comment)
    } else if(e.target.id === 'post-btn'){
        handlepostBtnClick()
    } else if(e.target.classList.contains('fa-trash')){
        handleDeletepostClick(e.target.dataset.delete); // CALL DELETE HANDLER
    }
})



// FUNCTION TO HANDLE LIKE CLICK
function handleLikeClick(postId){
    const targetPostObj = postsData.filter(function(post){
        return postId === post.uuid
    })[0]

    // INCREASE AND DECREASE THE LIKE BUTTON AND SETTING THE LIKE STATE
    if(targetPostObj.isLiked){
        targetPostObj.likes--
        targetPostObj.isLiked = false
    } else {
        targetPostObj.likes++
        targetPostObj.isLiked = true
    }

    savepostToLocalStorage();
    renderPostInFeed()
}


// FUNCTION TO HANDLE REPOST CLICK
function handleRepostClick(postId){
    const targetRepostObj = postsData.filter(function(post){
        return postId === post.uuid
    })[0]

    // INCREASE AND DECREASE THE REPOST BUTTON AND SETTING THE REPOST STATE
    if(targetRepostObj.isReposted){
        targetRepostObj.repost--
        targetRepostObj.isReposted = false
    } else {
        targetRepostObj.repost++
        targetRepostObj.isReposted = true
    }

    savepostToLocalStorage();
    renderPostInFeed()
}


// FUNCTION TO HANDLE BOOKMARK CLICK
function handleBookmarkClick(postId){
    const targetPostObj = postsData.filter(function(post){
        return postId === post.uuid
    })[0]

    // INCREASE AND DECREASE THE BOOKMARKS BUTTON AND SETTING THE BOOKMARKS STATE
    if(targetPostObj.isBookMarked){
        
    }
    targetPostObj.isBookMarked = !targetPostObj.isBookMarked

    savepostToLocalStorage();
    renderPostInFeed()
}



// FUNCTION TO HANDLE COMMENT CLICK
function handleReplyClick(postId){
    document.getElementById(`replies-${postId}`).classList.toggle('hidden')
    
}



// FUNCTION TO HAND POST BTN CLICK
function handlepostBtnClick(){

    if(postDataInput.value != '') {
        postsData.unshift({ 
            profileName: `Guest`,
            handle: `@Guest`,
            profileLink: `https://x.com/`,
            profilePic: `images/x-clone.png`,
            likes: 0,
            reposts: 0,
            postText: postDataInput.value,
            bookmarks: ``,
            replies: [],
            isLiked: false,
            isReposted: false,
            isBookmarked: false,
            uuid: uuidv4(),
    })
        postDataInput.value = ''
        savepostToLocalStorage();
        renderPostInFeed()
        
    } 

    
}


// FUNCTION TO SAVE POST TO LOCAL STORAGE
function savepostToLocalStorage() {
    localStorage.setItem("postsData", JSON.stringify(postsData));
}



// FUNCTION TO HANDLE DELETE POST CLICK (ONLY FOR GUEST POST)
function handleDeletepostClick(postId) {
    // FIND THE POST BY UUID
    const postIndex = postsData.findIndex(post => post.uuid === postId);

    if (postIndex !== -1) {
        // REMOVE THE POST FROM THE ARRAY (DELETE THE GUEST POST)
        postsData.splice(postIndex, 1);
        savepostToLocalStorage(); // SAVE UPDATED DATA TO LOCALSTORAGE
        renderPostInFeed(); // RE-RENDER THE FEED
    }
}




// FUNCTION TO GET post FEEDS
function getPostFeeds(){
    
    let feedHtml = ""
    // LOOPING THROUGH post DATA TO APPEND TO FEED HTML
    for ( let post of postsData){

        // CHECKING IF LIKE STATE HAS CHANGED TO ADD THE LIKED CLASS
        let likeIconClass = ''

        if(post.isLiked){
            likeIconClass = 'liked'
        }

        // CHECKING IF LIKE STATE HAS CHANGED TO ADD THE LIKED CLASS
        let repostIconClass = ''
        
        if(post.isReposted){
            repostIconClass = 'reposted'
        }

        // CHECKING IF LIKE STATE HAS CHANGED TO ADD THE LIKED CLASS
        let bookmarkIconClass = ''

        if(post.isBookMarked){
            bookmarkIconClass = 'bookmarked'
        }

        // LOOPING THROUGH REPLIES ARRAY TO APPEND TO REPLIES HTML
        let repliesHtml = ''

        if(post.replies.length > 1){
            for( let replies of post.replies){
                repliesHtml += `
                <div class="post-reply">
                    <div class="post-inner">
                        <a href="${replies.profileLink}" target="_blank">
                            <img class="profile-pic" src="${replies.profilePic}">
                        </a>
                            <div>
                                <a class="profile-name" href="${replies.profileLink}" target="_blank">${replies.profileName}</a>
                                <a class="handle" href="${replies.profileLink}" target="_blank">${replies.handle}</a>
                                <p class="post-text">${replies.postText}</p>
                            </div>
                        </div>
                </div>`
            }
        }


        // ADD A DELETE BUTTON FOR GUEST POST ONLY
        let deleteButtonHtml = '';
        if (post.profileName === 'Guest') {
            deleteButtonHtml = `
            <i class="fa-solid fa-trash" data-delete="${post.uuid}"></i>`
        }


    


        // APPENDIND HTML STRINGS TO FEED HTML
        feedHtml += `
        <div class="post">
            <div class="post-inner">
                    <a href="${post.profileLink}" target="_blank">
                        <img class="profile-pic" src="${post.profilePic}">
                    </a>
                <div>
                    <a class="profile-name" href="${post.profileLink}" target="_blank">${post.profileName}</a>
                    <a class="handle" href="${post.profileLink}" target="_blank">${post.handle}</a>
                    <!-- Delete button here -->
                        ${deleteButtonHtml} 
                    <!-- Delete button here -->
                    <p class="post-text">${post.postText}</p>
                    <div class="post-details">
                        <span class="post-detail">
                            <i class="fa-regular fa-comment-dots" data-comment="${post.uuid}"></i> 
                            ${post.replies.length}
                        </span>
                        <span class="post-detail">
                            <i class="fa-solid fa-retweet ${repostIconClass}" data-repost="${post.uuid}"></i>
                            ${post.reposts}
                        </span>
                        <span class="post-detail">
                            <i class="fa-solid fa-heart ${likeIconClass}" data-like="${post.uuid}"></i>
                            ${post.likes}
                        </span>
                        </span>
                        <span class="post-detail">
                            <i class="fa-solid fa-bookmark ${bookmarkIconClass}" data-bookmark="${post.uuid}"></i>
                            ${post.bookmarks}
                        </span>
                    </div>   
                </div>            
            </div>

            <div class="hidden" id="replies-${post.uuid}">
                ${repliesHtml}
            </div> 

        </div>`
    }
    return feedHtml
}

// FUNCTION TO RENDER POST IN FEED DIV
function renderPostInFeed(){
    document.getElementById('feed').innerHTML = getPostFeeds()
}

renderPostInFeed(postsData)


