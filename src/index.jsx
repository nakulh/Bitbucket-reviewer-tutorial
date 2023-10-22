import { fetchComment, createComment, fetchPullRequest, fetchRawDiff } from "/src/api.jsx";
import { getReviewForPullRequest } from "/src/ai.jsx";

export async function run(event, context) {
	if (event.actor.type !== "user") return;
	console.log(JSON.stringify(event, null, 6));
	let comment = await fetchComment(event);
	if (isReviewComment(comment.content.raw)) {
		console.log("is review comment");
		await reviewPullRequest(event);
		return;
	  }
}

const reviewPullRequest = async (event) => {
	let pr = await fetchPullRequest(event.pullrequest.id, event.repository.uuid, event.workspace.uuid);
	console.log("PR");
	console.log(JSON.stringify(pr, null, 6));
	let diff = await fetchRawDiff(pr.destination.commit.hash, pr.source.commit.hash, event.repository.uuid, event.workspace.uuid);
	console.log("diff");
	console.log(diff);
	let review = await getReviewForPullRequest(diff);
	console.log("The review is " + review);
	await createComment(review, event.pullrequest.id, event.repository.uuid, event.workspace.uuid);
}

const isReviewComment = (commentContent) => {
    return commentContent.startsWith("/ReviewPR"); 
}