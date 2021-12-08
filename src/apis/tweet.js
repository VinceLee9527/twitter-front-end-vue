import { apiHelper } from "./../utils/helpers";

export default {
    addNewTweet({
        newTweet
    }) {
        return apiHelper.post('/tweets',
            newTweet
        )
    },
    getTweet({ tweetId }) {

        return apiHelper.get(`/tweets/${tweetId}`)
    },
    getTweetReplies({ tweetId }) {
        return apiHelper.get(`/tweets/${tweetId}/replies`)
    },
    getAllTweets() {
        return apiHelper.get('/tweets')
    },
    addLike({ tweetId }) {
        return apiHelper.post(`/tweets/${tweetId}/like`, null)
    },
    deleteLike({ tweetId }) {
        return apiHelper.post(`/tweets/${tweetId}/unlike`, null)
    },
    addTweetReply({
        tweetId,
        comment
    }) {
        return apiHelper.post(`/tweets/${tweetId}/replies`, {
            comment: comment
        })
    }
}