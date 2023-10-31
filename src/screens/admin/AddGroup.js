import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { db } from '../../firebase/firebase'
import { collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import InputFileld from '../../componentes/Inputs/input'
import InputFEspecial from '../../componentes/Inputs/InputEspecial'
import InputCupo from '../../componentes/Inputs/inputCupo'
import { StatusBar } from 'expo-status-bar'
import { getAllhoras, gruposFun, maestrosFun } from '../../firebase/cloudstorage/horario'
import Dropdown from '../../componentes/Inputs/DropDown/DropDown'

const AddGroup = ({ navigation }) => {
    const info = useRoute().params
    const [grupos, setGrupos] = useState([
        {label: "A-1", value: "A-1"},
        {label: "A-2", value: "A-2"},
        {label: "A-3", value: "A-3"},
        {label: "A-4", value: "A-4"},
        {label: "A-5", value: "A-5"},
        {label: "A-6", value: "A-6"},
        {label: "A-7", value: "A-7"},
        {label: "A-8", value: "A-8"},
        {label: "A-9", value: "A-9"},
        {label: "A-10", value: "A-10"},
        {label: "B-1", value: "B-1"},
        {label: "B-2", value: "B-2"},
        {label: "B-3", value: "B-3"},
        {label: "B-4", value: "B-4"},
        {label: "B-5", value: "B-5"},
        {label: "B-6", value: "B-6"},
        {label: "B-7", value: "B-7"},
        {label: "B-8", value: "B-8"},
        {label: "B-9", value: "B-9"},
        {label: "B-10", value: "B-10"},
        {label: "C-1", value: "C-1"},
        {label: "C-2", value: "C-2"},
        {label: "C-3", value: "C-3"},
        {label: "C-4", value: "C-4"},
        {label: "C-5", value: "C-5"},
        {label: "C-6", value: "C-6"},
        {label: "C-7", value: "C-7"},
        {label: "C-8", value: "C-8"},
        {label: "C-9", value: "C-9"},
        {label: "C-10", value: "C-10"},
    ]);
    const [maestros, setMaestros] = useState([]);

    const [data, setData] = useState([
        {label: "00:00", value: "00:00"},
        {label: "01:00", value: "02:00"},
        {label: "03:00", value: "03:00"},
        {label: "04:00", value: "04:00"},
        {label: "05:00", value: "05:00"},
        {label: "06:00", value: "06:00"},
        {label: "07:00", value: "07:00"},
        {label: "08:00", value: "08:00"},
        {label: "09:00", value: "09:00"},
        {label: "10:00", value: "10:00"},
        {label: "11:00", value: "11:00"},
        {label: "12:00", value: "12:00"},
        {label: "13:00", value: "13:00"},
        {label: "14:00", value: "14:00"},
        {label: "15:00", value: "15:00"},
        {label: "16:00", value: "16:00"},
        {label: "17:00", value: "17:00"},
        {label: "18:00", value: "18:00"},
        {label: "19:00", value: "19:00"},
        {label: "20:00", value: "20:00"},
        {label: "21:00", value: "21:00"},
        {label: "22:00", value: "22:00"},
        {label: "23:00", value: "23:00"},
    ]);
    const [loading, isLoading] = useState(true);

    const initialDatos = {
        type_group: '',
        status: '',
        schedule: '',
        description: '',
        name_teac: '',
        matricula_alumno: [],
        cupo: '',
        price: '',
    }



    const [datos, setDatos] = useState(
        info
            ? { ...info }
            : initialDatos
    );

    const autenticar = async () => {
        const gruposReference = doc(collection(db, "Groups"));
        await setDoc(gruposReference, datos);
        console.log(datos)
        console.log("agreganding...")
        navigation.goBack()
        
    }

    const desactivar = async () => {
        const infoGroups = doc(db, "Groups", datos.id);
        await updateDoc(infoGroups, {
            status: !info.status
        });
    }

    const actualizar = async () => {
        const infoGroups = doc(db, "Groups", datos.id);
        await updateDoc(infoGroups, {
            schedule: datos.schedule,
            description: datos.description,
            name_teac: datos.name_teac,
            price: datos.price,
        });
        console.log("ACTUALIZANDING...")
        navigation.goBack()
    }

    const boton = () => {
        desactivar();
        navigation.navigate("Groups")
    }

    useEffect(
        () => {
            // gruposFun().then((grups) => {
            //     isLoading(true);
            //     setGrupos(grups);
            //     isLoading(false);
            // })
            maestrosFun().then((maes) => {
                isLoading(true);
                setMaestros(maes)
                isLoading(false);
            })
            // getAllhoras().then((horas) => {
            //     isLoading(true);
            //     setData(horas)
            //     console.log(horas)
            //     isLoading(false);
            // })
        }, []
    )
    return (
        <View className="w-full  ml-4 p-7">
            <Text className="text-lg mb-3"> Información de grupos</Text>
            {loading
                ? null
                : <Dropdown
                    list={grupos}
                    title={"Grupos"}
                    name={"type_group"}
                    setValue={setDatos}
                    value={datos} />
            }
            <InputFileld
                title={"Descripción"}
                props={"Grupo niños principiantes"}
                edita={info ? true : true}
                max={100}
                name={"description"}
                setValue={setDatos}
                value={datos} />

            {loading
                ? null
                : <Dropdown
                    list={maestros}
                    title={"Maestros"}
                    name={"name_teac"}
                    setValue={setDatos}
                    value={datos} />
            }
            {loading
                ? null
                : <Dropdown
                    list={data}
                    title={"Horaro"}
                    name={"schedule"}
                    setValue={setDatos}
                    value={datos} />}

            <View>
                <InputCupo
                    title={"Cupo"}
                    props={"20"}
                    edita={info ? false : true}
                    max={3}
                    name={"cupo"}
                    setValue={setDatos}
                    value={datos} />
            </View>

            <View className="flex-row">
                <InputFEspecial
                    title={"Usar mensualidad base?"}
                    props={"1500"}
                    name={"price"}
                    setValue={setDatos}
                    value={datos}
                />

            </View>
            <TouchableOpacity
                onPress={info ?
                    () => actualizar()
                    : () => autenticar()}
                className="rounded-md bg-blue-400 p-4 w-80 items-center mt-6 mb-10">
                <Text className="text-lg text-white font-bold">
                    {info
                        ? "Actualizar grupo"
                        : "Guardar grupo"}
                </Text>
            </TouchableOpacity>
            {info
                ? <TouchableOpacity
                    onPress={() => boton()}
                    className={"rounded-md p-4 color w-80 items-center mt-2 mb-10 " + (info.status ? 'bg-red' : 'bg-green')}>
                    <Text className="text-lg text-white font-bold">
                        {info.status ? "Desactivar" : "Activar"}
                    </Text>
                </TouchableOpacity>
                : null}

            <StatusBar backgroundColor={'#6560AA'} />

        </View>
    )
}

export default AddGroup