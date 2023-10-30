import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { db } from '../../firebase/firebase'
import { collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore'
import InputFileld from '../../componentes/Inputs/input'
import DropdownGroups from '../../componentes/Inputs/DropDown/DropDownGroups'
import DropDownMaestros from '../../componentes/Inputs/DropDown/DropDownMaestros'
import DropdownBase from '../../componentes/Inputs/DropDown/DropDownBase'
import InputFEspecial from '../../componentes/Inputs/InputEspecial'
import InputCupo from '../../componentes/Inputs/inputCupo'
import { StatusBar } from 'expo-status-bar'
import Dropdown from '../../componentes/Inputs/DropDown/DropDown'
import { getAllhoras, gruposFun, maestrosFun } from '../../firebase/cloudstorage/horario'

const AddGroup = ({ navigation }) => {
    const info = useRoute().params
    const [grupos, setGrupos] = useState([]);
    const [maestros, setMaestros] = useState([]);

    const [data, setData] = useState([]);
    const [loading, isLoading] = useState(true);

    const initialDatos = {
        type_groups: '',
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
            schedule: data.schedule,
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
            gruposFun().then((grups) => {
                setGrupos(grups);
                isLoading(false);
            })
            maestrosFun().then((maes) => {
                setMaestros(maes)
                isLoading(false);
            })
            getAllhoras().then((horas) => {
                setData(horas)
                isLoading(false);
            })
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
                    setValue={setGrupos}
                    value={grupos} />
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
                    setValue={setMaestros}
                    value={maestros} />
            }
            {loading
                ? null
                : <Dropdown
                    list={data}
                    title={"Horario"}
                    name={"schedule"}
                    setValue={setData}
                    value={data} />}

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