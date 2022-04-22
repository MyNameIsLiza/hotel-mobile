import {StatusBar} from 'expo-status-bar';
import {Button, Image, Picker, StyleSheet, Text, TextInput, View} from 'react-native';
import {useEffect, useState, useContext, createContext, useCallback} from "react";
import {deleteRoom, editRoom, getRooms} from "./api/rooms";
import {getRoomTypes} from "./api/roomTypes";
import {DataTable} from 'react-native-paper';
import {Formik} from 'formik';
import {addRoom} from "./api";
import defaultImage from "./assets/defaultImage.png";

const RoomsContext = createContext(null);

function defaultRoom(roomType) {
    return {
        roomNumber: '',
        roomType: roomType,
        roomTypeId: roomType._id,
        description: '',
        image: defaultImage
    }
}

function error(message = 'Помилка!') {
    alert(message);
}

export default function App() {
    const [room, setRoom] = useState({});
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    useEffect(() => {
        getRoomTypes().then((types) => {
            setRoom(defaultRoom(types[0]))
            setRoomTypes(types);
            getRooms().then((res) => {
                if (Array.isArray(res)) {
                    const rooms = res.map((el) => {
                        el.roomType = types.find((type) => {
                            return type._id === el.roomTypeId
                        });
                        return el;
                    })
                    setRooms(rooms);
                }
            });
        });
    }, [getRooms, getRoomTypes])

    return (
        <View style={styles.container}>
            <RoomsContext.Provider
                value={{rooms, setRooms, room, setRoom, roomTypes}}>
                <Form/>
                <Table/>
            </RoomsContext.Provider>
            <StatusBar style="auto"/>
        </View>
    );
}

function Form() {
    const {room, rooms, setRooms, setRoom, roomTypes} = useContext(RoomsContext);

    const submitForm = useCallback((values, {resetForm}) => {
        console.log(values)
        if (!values.roomNumber) {
            return error('Помилка! Заповніть всі поля');
        }
        const shallowRooms = [...rooms];
        if (values._id) {
            try {
                editRoom(values).then(res => {
                    const index = shallowRooms.findIndex((item) => item._id === res._id);
                    shallowRooms[index] = res;
                    shallowRooms[index].roomType = roomTypes.find((el) => el._id === shallowRooms[index].roomTypeId);
                    setRooms(shallowRooms);
                });
            } catch (e) {
                error('Помилка!');
            }
        } else {
            try {
                addRoom(values).then(res => {
                    const shallowRoom = res;
                    shallowRoom.roomType = roomTypes.find((el) => el._id === shallowRoom.roomTypeId);
                    setRooms([...rooms, shallowRoom])
                });
            } catch (e) {
                error('Помилка!');
            }
        }
        resetForm({values: defaultRoom()})
        setRoom(defaultRoom());
    }, [rooms, defaultRoom]);

    return <Formik
        initialValues={{...room}}
        onSubmit={submitForm}
        enableReinitialize
    >
        {({handleChange, handleBlur, handleSubmit, values}) => (
            <View style={styles.form}>
                <View>
                    <Text>Room number</Text>
                    <TextInput
                        onChangeText={handleChange('roomNumber')}
                        onBlur={handleBlur('roomNumber')}
                        value={values['roomNumber']}
                        style={styles.input}
                    />
                    <Text>Room type</Text>
                    <Picker
                        selectedValue={room.roomType?._id}
                        style={{height: 50, width: 150}}
                        onValueChange={(itemValue, itemIndex) => {
                            setRoom({
                                ...room,
                                roomTypeId: itemValue,
                                roomType: roomTypes.find((el) => el._id === itemValue)
                            });
                        }
                        }
                    >
                        {roomTypes.map((el) =>
                            <Picker.Item label={el.title} value={el?._id}/>)
                        }
                    </Picker>
                    <Text>Description</Text>
                    <TextInput
                        onChangeText={handleChange('description')}
                        onBlur={handleBlur('description')}
                        value={values['description']}
                        style={styles.textarea}
                        multiline
                    />
                </View>
                <Button onPress={handleSubmit} title="Submit"/>
            </View>
        )}
    </Formik>
}

function Table() {
    const {rooms, setRoom, setRooms} = useContext(RoomsContext);
    return (<View>{
        rooms.length ?
            <DataTable>
                <DataTable.Header>
                    <DataTable.Title>Room #</DataTable.Title>
                    <DataTable.Title>Room type</DataTable.Title>
                    <DataTable.Title>Price</DataTable.Title>
                    <DataTable.Title>Description</DataTable.Title>
                    <DataTable.Title>Edit</DataTable.Title>
                    <DataTable.Title>Delete</DataTable.Title>
                </DataTable.Header>
                {rooms.map((el) =>
                    <DataTable.Row key={el.roomNumber}>
                        <DataTable.Cell>{el.roomNumber}</DataTable.Cell>
                        <DataTable.Cell>{el.roomType.title}</DataTable.Cell>
                        <DataTable.Cell>{el.roomType.price}</DataTable.Cell>
                        <DataTable.Cell>{el.description}</DataTable.Cell>
                        <DataTable.Cell><Button onPress={() => {
                            setRoom(el);
                        }} title="E"/></DataTable.Cell>
                        <DataTable.Cell><Button onPress={() => {
                            const shallowRooms = [...rooms];
                            deleteRoom(el).then(res => {
                                const index = shallowRooms.findIndex((item) => item._id === res._id);
                                shallowRooms.splice(index, 1);
                                setRooms(shallowRooms);
                            });
                        }} title="D"/></DataTable.Cell>
                    </DataTable.Row>)}
            </DataTable> : <Text>Phone book is empty</Text>
    }</View>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bold: {
        fontWeight: 'bold'
    },
    img: {
        height: 100,
        width: 200
    },
    input: {
        height: 40,
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    },
    textarea:{
        height: 50,
        borderBottomColor: '#000000',
        borderBottomWidth: 1
    },
    form:{
        gap:5
    }
});
