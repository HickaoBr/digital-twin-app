import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../src/screens/Home/HomeScreen";
import SensorScreen from "../src/screens/Sensors/SensorsScreen";
import { Feather, Ionicons } from "@expo/vector-icons";
import HistoricoScreen from "../src/screens/Historico";
import ConfigScreen from "../src/screens/ConfigScreen";

const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    return(
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen
            name = 'Home'
            component={HomeScreen}
            options={{
                tabBarIcon: ({color , size}) => <Feather name="home" color={color}
                size={size}/>,
                tabBarLabel: 'Início'
            }}
            />
            <Tab.Screen
            name = 'Histórico'
            component={HistoricoScreen}
            options={{
                tabBarIcon: ({color , size}) => <Feather name='archive' color={color}
                size={size}/>,
                tabBarLabel: 'Histórico'
            }}
            />
            <Tab.Screen
                name="Sensores"
                component={SensorScreen}
                options={{
                tabBarIcon: ({ color, size }) => (
                <Ionicons name="hardware-chip-outline" size={size} color={color} />
                ),
                tabBarLabel: 'Sensores'
                }}
            />
            <Tab.Screen
                name="Configurações"
                component={ConfigScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="settings" size={size} color={color} />
                    ),
                    tabBarLabel: 'Configurações'
                }}
            />
        </Tab.Navigator>
    )
}