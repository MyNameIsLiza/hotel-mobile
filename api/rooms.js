import axios from "axios";

const uri = "https://liza-hotel-api.herokuapp.com/api/rooms";

function getRooms() {
    return axios
        .get(uri)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function addRoom(room) {
    return axios
        .post(uri + "/add", room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}

function editRoom(room) {
    return axios
        .post(uri + "/edit", room)
        .then((res) => {
            console.log(res.data);
            return res.data.result;
        })
        .catch((err) => {
            console.log(err);
            return err.message;
        });
}

function deleteRoom(room) {
    return axios
        .delete(uri + "/" + room._id, room)
        .then((res) => {
            return res.data.result;
        })
        .catch((err) => {
            return err.message;
        });
}
export { getRooms, addRoom, editRoom, deleteRoom };
