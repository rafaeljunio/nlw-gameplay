import React, { useState, useEffect } from 'react';
import { ImageBackground, Text, View, FlatList, Alert } from 'react-native';
import { styles } from './styles';
import { Fontisto } from '@expo/vector-icons';
import { Background } from "../../components/Background";
import { Header } from "../../components/Header";
import { BorderlessButton } from 'react-native-gesture-handler';
import { theme } from '../../global/styles/theme';

import { ListHeader } from '../../components/ListHeader';
import { Member, MemberProps } from '../../components/Member';

import { ListDivider } from '../../components/ListDivider';

import BannerImg from '../../assets/banner.png';

import { ButtonIcon } from '../../components/ButtonIcon';
import { useRoute } from '@react-navigation/native';
import { AppointmentProps } from '../../components/Appointment';
import { api } from '../../services/api';
import { Load } from '../../components/Load';

type Params = {
    guildSelected: AppointmentProps
}

type GuildWidget = {
    id: string;
    name: string;
    instant_invite: string;
    members: MemberProps[];
    presence_count: number;
}

export function AppointmentDetails() {
    const [widget, setWidget] = useState<GuildWidget>({} as GuildWidget);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const { guildSelected } = route.params as Params;

    async function fetchGuildWidget() {
        try {
            const response = await api.get(`/guilds/${guildSelected.guild.id}/widget.json`);
            setWidget(response.data);
            setLoading(false);
        } catch {
            Alert.alert('Verifique as configurações do servidor.');
        } finally {
            setLoading(false);
        }
    }

    const members = [
        {
            id: '1',
            username: 'Rafael',
            avatar_url: 'https://github.com/rafaeljunio.png',
            status: 'online'
        },
        {
            id: '2',
            username: 'Rafael',
            avatar_url: 'https://github.com/rafaeljunio.png',
            status: 'offline'
        }
    ];

    useEffect(() => {
        fetchGuildWidget();
        //setLoading(false);
    }, []);

    return (
        <Background>
            <Header
                title="Detalhes"
                action={
                    <BorderlessButton>
                        <Fontisto
                            name="share"
                            size={24}
                            color={theme.colors.primary}
                        />
                    </BorderlessButton>
                }
            />

            <ImageBackground
                source={BannerImg}
                style={styles.banner}
            >
                <View style={styles.bannerContent}>
                    <Text style={styles.title}>
                        {guildSelected.guild.name}
                    </Text>
                    <Text style={styles.subtitle}>
                        {guildSelected.description}
                    </Text>
                </View>




            </ImageBackground>
            {
                loading ? <Load /> :
                    <>
                        <ListHeader
                            title="Jogadores"
                            //subtitle="Total 3"
                            subtitle={`Total ${widget.members.length}`}
                        />

                        <FlatList
                            //data={members}
                            data={widget.members}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <Member data={item} />
                            )}
                            ItemSeparatorComponent={() => <ListDivider isCentered />}
                            style={styles.members}
                        />
                    </>
            }
            <View style={styles.footer}>
                <ButtonIcon title="Entrar na Partida" />
            </View>

        </Background>
    );
}
