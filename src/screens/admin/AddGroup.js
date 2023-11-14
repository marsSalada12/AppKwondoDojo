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
import ModalError from '../../componentes/Modals/MAddUserError'
import GroupInfo from '../../componentes/Modals/GroupInfo'
import { DropdownGroup } from '../../componentes/Inputs/DropDown/DropDownGrupo'

const AddGroup = ({ navigation }) => {

    const [loading, isLoading] = useState(true);
    const info = useRoute().params

    const [data, setData] = useState([
        { label: "00:00", value: "00:00" },
        { label: "01:00", value: "01:00" },
        { label: "02:00", value: "02:00" },
        { label: "03:00", value: "03:00" },
        { label: "04:00", value: "04:00" },
        { label: "05:00", value: "05:00" },
        { label: "06:00", value: "06:00" },
        { label: "07:00", value: "07:00" },
        { label: "08:00", value: "08:00" },
        { label: "09:00", value: "09:00" },
        { label: "10:00", value: "10:00" },
        { label: "11:00", value: "11:00" },
        { label: "12:00", value: "12:00" },
        { label: "13:00", value: "13:00" },
        { label: "14:00", value: "14:00" },
        { label: "15:00", value: "15:00" },
        { label: "16:00", value: "16:00" },
        { label: "17:00", value: "17:00" },
        { label: "18:00", value: "18:00" },
        { label: "19:00", value: "19:00" },
        { label: "20:00", value: "20:00" },
        { label: "21:00", value: "21:00" },
        { label: "22:00", value: "22:00" },
        { label: "23:00", value: "23:00" },
    ]);

    const [grupos, setGrupos] = useState([]);
    const [maestros, setMaestros] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showModalErr, setShowModalErr] = useState(false)
    const [mensaje, setMensaje] = useState('')
    const [ocupado, setOCupado] = useState(false)

    const initialDatos = {
        type_group: '',
        status: true,
        schedule: '',
        description: '',
        name_teac: '',
        matricula_alumno: [],
        cupo: '',
        price: '',
        cont_alumnos: 0
    }

    const [datos, setDatos] = useState(
        info
            ? { ...info }
            : initialDatos
    );

    // Metodo para guardar a un grupo en la BD
    const autenticar = async () => {
        if (VerificarFormulario() && !ocupado) {
            console.log('insertamos el grupo')
            const gruposReference = doc(collection(db, "Groups"));
            await setDoc(gruposReference, datos);
            console.log(datos)
            console.log("agreganding...")
            navigation.goBack()
        } else {
            setMensaje('Formulario incompleto o\nEl maestro ya tiene grupo a esa hora')
            setShowModalErr(true)
            console.log('no lo insertamos')
        }
    }

    //Mëtodo para comprobar si el maestro ya tiene un grupo a esa hora
    useEffect(() => {
        maesHoras()
    }, [datos])

    const maesHoras = async () => {
        const maestro = datos.name_teac;
        const horario = datos.schedule;
        const gruposQuery = query(collection(db, "Groups"), where("name_teac", "==", maestro), where("schedule", "==", horario));
        const gruposSnapshot = await getDocs(gruposQuery);
        setOCupado(gruposSnapshot.size != 0);

    }

    //Funcion para verificar que el formulario se haya llenado completo
    // Vamos a devolver "true" si el formulario esta completo
    const VerificarFormulario = () => {
        return (datos.cupo
            && datos.description
            && datos.name_teac
            && datos.price
            && datos.schedule
            && datos.type_group)
    }

    // Metodo para cambiar el estado de un grupo
    const desactivar = async () => {
        const infoGroups = doc(db, "Groups", datos.id);
        await updateDoc(infoGroups, {
            status: !info.status
        });
    }

    // Metodo para actualizar la informacion del grupo
    const actualizar = async () => {
        if (VerificarFormulario()) {
            const infoGroups = doc(db, "Groups", datos.id);
            await updateDoc(infoGroups, {
                schedule: datos.schedule,
                description: datos.description,
                name_teac: datos.name_teac,
            });

            console.log("ACTUALIZANDING...")
            navigation.goBack()
        } else {
            setMensaje('Formulario incompleto o\nEl maestro ya tiene grupos a esa hora')
            setShowModalErr(true)
            console.log('no lo insertamos')
        }
    }

    const boton = () => {
        desactivar();
        navigation.navigate("Groups")
    }

    useEffect(
        () => {
            gruposFun().then((grups) => {
                isLoading(true);
                setGrupos(grups);
                isLoading(false);
            })
            maestrosFun().then((maes) => {
                isLoading(true);
                setMaestros(maes)
                isLoading(false);
            })
        }, []
    )
    return (
        <ScrollView
            nestedScrollEnabled={true}>
            <View className="ml-4 p-7">
                <ModalError
                    setVisible={setShowModalErr}
                    visible={showModalErr}
                    message={mensaje}
                />
                <GroupInfo
                    setVisible={setShowModal}
                    visible={showModal}
                />
                <Text className="text-lg mb-3"> Información de grupos</Text>
                {
                    loading
                        ? null
                        : <DropdownGroup
                            list={grupos}
                            title={"Grupos"}
                            active={info ? false : true}
                            name={"type_group"}
                            setValue={setDatos}
                            value={datos} />
                }
                {info
                    ?
                    <Text className='text-red'>
                        No se puede actualizar tipo grupo
                    </Text>
                    : null}
                <InputFileld
                    title={"Descripción"}
                    props={" "}
                    edita={info ? true : true}
                    max={100}
                    name={"description"}
                    setValue={setDatos}
                    value={datos}
                    type={'letters'} />

                {
                    loading
                        ? null
                        : <Dropdown
                            list={maestros}
                            title={"Maestros"}
                            name={"name_teac"}
                            setValue={setDatos}
                            value={datos} />
                }

                {
                    loading
                        ? null
                        : <View>
                            <Dropdown
                                list={data}
                                title={"Horario"}
                                name={"schedule"}
                                setValue={setDatos}
                                value={datos} />
                            {
                                ocupado
                                    ?
                                    <Text className='text-red'>
                                        {datos.name_teac} ya tiene grupo a esa hora
                                    </Text>
                                    : null

                            }
                        </View>
                }

                <InputCupo
                    title={"Cupo"}
                    props={" "}
                    edita={info ? true : true}
                    max={3}
                    name={"cupo"}
                    setValue={setDatos}
                    value={datos}
                    type={'numeric'} />

                <InputFEspecial
                    title={"Usar mensualidad base?"}
                    props={" "}
                    name={"price"}
                    setValue={setDatos}
                    value={datos}
                    type={'numeric'}
                />

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
        </ScrollView>
    )
}

export default AddGroup