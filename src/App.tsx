import Routes from "./routes/Routes";
import { initSessionStorage } from "./sessionStorage/storageServices"

export default function App() {
    initSessionStorage();
    
    return (<Routes />);
}