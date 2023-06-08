import mainMenu from './mainMenu';
import nurseMenu from './nurseMenu';
import patientMenu from './patientMenu';
import physicianMenu from './physicianMenu';
import receptionistMenu from './receptionistMenu';

// ==============================|| MENU ITEMS ||============================== //

let menuItems = { items: [...mainMenu, ...receptionistMenu, ...nurseMenu, ...physicianMenu, ...patientMenu] };

export default menuItems;
