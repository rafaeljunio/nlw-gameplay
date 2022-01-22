import React, { useState, useCallback } from 'react';
import { View, FlatList, Text } from 'react-native';
import { ButtonAdd } from '../../components/ButtonAdd';
import { CategorySelect } from '../../components/CategorySelect';
import { ListHeader } from '../../components/ListHeader';
import { Appointment, AppointmentProps } from '../../components/Appointment';
import { ListDivider } from '../../components/ListDivider';

import { Background } from "../../components/Background";
import { Load } from "../../components/Load";

import { Profile } from '../../components/Profile';

import { styles } from './styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLLECTION_APPOINTMENTS } from '../../configs/database';
import AsyncStorage from '@react-native-async-storage/async-storage';


export function Home() {
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState<AppointmentProps[]>([]);

    const navigation = useNavigation();

    /*
    const appointments = [
        {
            id: '1',
            guild: {
                id: '1',
                name: 'Lendários',
                icon: null,
                owner: true
            },
            category: '1',
            date: '22/06 às 20:40h',
            description: 'É hj vem que tem'
        },
        {
            id: '2',
            guild: {
                id: '1',
                name: 'Lendários',
                icon: null,
                owner: true
            },
            category: '1',
            date: '22/06 às 20:40h',
            description: 'É hj vem que tem'
        },
        {
            id: '3',
            guild: {
                id: '1',
                name: 'Lendários',
                icon: null,
                owner: true
            },
            category: '1',
            date: '22/06 às 20:40h',
            description: 'É hj vem que tem'
        },
        {
            id: '4',
            guild: {
                id: '1',
                name: 'Lendários',
                icon: null,
                owner: true
            },
            category: '1',
            date: '22/06 às 20:40h',
            description: 'É hj vem que tem'
        },
    ]
    */

    function handleCategorySelect(categoryId: string) {
        categoryId === category ? setCategory('') : setCategory(categoryId);
    }

    function handleAppointmentDetails(guildSelected: AppointmentProps) {
        navigation.navigate('AppointmentDetails', { guildSelected });
    }

    function handleAppointmentCreate() {
        navigation.navigate('AppointmentCreate');
    }

    async function loadAppointments() {
        //AsyncStorage.clear();
        const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
        const storage: AppointmentProps[] = response ? JSON.parse(response) : [];
        //const storage: AppointmentProps[] =  [];

        if (category) {
            setAppointments(storage.filter(item => item.category === category));
        } else {
            setAppointments(storage)
        }
        setLoading(false);
    }

    useFocusEffect(useCallback(()=>{
        loadAppointments();
    }, [category]));

    return (
        <Background>
            <View style={styles.header}>
                <Profile />
                <ButtonAdd onPress={handleAppointmentCreate} />
            </View>

            <CategorySelect
                categorySelected={category}
                setCategory={handleCategorySelect}
            />

            {
                loading ? <Load /> :
            <>
            <ListHeader
                title="Partidas agendadas"
                subtitle={`Total: ${appointments.length}`}
            />

            <FlatList
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <Appointment
                        data={item}
                        onPress={() => handleAppointmentDetails(item)}
                    />
                )}
                ItemSeparatorComponent={() => <ListDivider />}
                contentContainerStyle={{ paddingBottom: 69 }}
                style={styles.matches}
                showsVerticalScrollIndicator={false}
            />
            </>
            }
        </Background>
    );
}