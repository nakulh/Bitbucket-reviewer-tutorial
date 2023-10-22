import api, { route } from "@forge/api";

export const fetchComment = async (event) => {
    const res = await api
      .asApp()
      .requestBitbucket(
        route`/2.0/repositories/${event.workspace.uuid}/${event.repository.uuid}/pullrequests/${event.pullrequest.id}/comments/${event.comment.id}`
      );
  
    return res.json();
  };


  export const fetchPullRequest = async (pullRequestId, repoUUID, workspaceUUID) => {
    const res = await api
      .asApp()
      .requestBitbucket(
        route`/2.0/repositories/${workspaceUUID}/${repoUUID}/pullrequests/${pullRequestId}`
      );
  
    return res.json();
  }
  
  export const fetchRawDiff = async (destinationCommitId, sourceCommitId, repoUUID, workspaceUUID) => {
    const res = await api
      .asApp()
      .requestBitbucket(
        route`/2.0/repositories/${workspaceUUID}/${repoUUID}/diff/${sourceCommitId}..${destinationCommitId}`
      );
  
    return res.text();
  }

  export const createComment = async (comment, pullRequestId, repoUUID, workspaceUUID) => {
    const requestRoute = route`/2.0/repositories/${workspaceUUID}/${repoUUID}/pullrequests/${pullRequestId}/comments`;
  
    const body = {
      content: {
        raw: comment,
      }
    };
  
    const requestDetails = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    };
  
    await api.asApp().requestBitbucket(requestRoute, requestDetails);
  }
