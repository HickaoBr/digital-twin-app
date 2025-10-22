import { NavigationContainer } from "@react-navigation/native";
import { useAuth } from "../src/context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import StackRoutes from "./stack.routes";
import LoginScreen from "../src/screens/Login/LoginScreen";
import { useEffect } from "react";

export default function Routes(){
    const { isAuthenticated, loading } = useAuth();

    useEffect(() => {
        console.log('Routes renderizando - isAuthenticated:', isAuthenticated, 'loading:', loading);
    }, [isAuthenticated, loading]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0E27' }}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return(
        <NavigationContainer key={isAuthenticated ? 'authenticated' : 'guest'}>
            {isAuthenticated ? <StackRoutes /> : <LoginScreen />}
        </NavigationContainer>
    )
}