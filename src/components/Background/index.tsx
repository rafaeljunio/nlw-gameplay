import React, {ReactNode} from 'react';


import {styles} from './styles';
import { theme } from '../../global/styles/theme';

import {LinearGradient} from 'expo-linear-gradient';

type Props = {
    children: ReactNode;
}

export function Background({children}: Props){
    const { secondary80, secondary100 } = theme.colors;

    return (
        <LinearGradient
            style={styles.container}
            colors={[secondary80, secondary100]}
        >
            {children}
        </LinearGradient>
    );
}