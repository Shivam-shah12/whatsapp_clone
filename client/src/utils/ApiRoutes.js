// export const HOST="http://localhost:8000";
export const HOST="https://chat-web-application-n2q6.onrender.com"

const AUTH_ROUTES=`${HOST}/api/auth`;
const MESSAGE_ROUTES=`${HOST}/api/messages`

export const CHECK_USER_ROUTE=`${AUTH_ROUTES}/check-user`

export const ONBOARD_USER_ROUTE=`${AUTH_ROUTES}/onboard-user`
export const GET_CALL_TOKEN=`${AUTH_ROUTES}/generate-token`
export const GET_CONTACT_USER=`${AUTH_ROUTES}/get-contacts`

export const ADD_MESSAGE_ROUTE=`${MESSAGE_ROUTES}/add-message`
export const GET_MESSAGE_ROUTE=`${MESSAGE_ROUTES}/get-message`
export const ADD_IMAGE_ROUTE=`${MESSAGE_ROUTES}/add-image-message`
export const ADD_DOCUMENT_ROUTE=`${MESSAGE_ROUTES}/add-document-message`
export const ADD_AUDIO_MESSAGE_ROUTE=`${MESSAGE_ROUTES}/add-audio-message`;
export const GET_INTIAL_CONTACTS_ROUTE=`${MESSAGE_ROUTES}/get-initial-contacts`