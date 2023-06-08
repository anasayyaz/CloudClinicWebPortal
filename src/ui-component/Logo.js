import logo from 'assets/images/cloud-clinic-logo.png';
import { domainLogo } from 'utils/fetchImage';

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    return (
        // if you want to use image instead of svg uncomment following, and comment out <svg> element.
        <img src={domainLogo()} alt="CloudClinicLogo" height="33" />
    );
};

export default Logo;
