import axios from "axios";

const uri = "https://liza-hotel-api.herokuapp.com/api/room_types";

function getRoomTypes() {
    return axios
        .get(uri)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function addRoomType(room) {
    return axios
        .post(uri + "/add", room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function editRoomType(room) {
    return axios
        .post(uri + "/edit", room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            console.log(err);
            return err.message;
        });
}

function deleteRoomType(room) {
    return axios
        .delete(uri + "/" + room._id, room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}
export { getRoomTypes, addRoomType, editRoomType, deleteRoomType };
