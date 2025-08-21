import Navbar from './homecomponents/navbar';
import HomeContent1 from './homecomponents/homecontent1';
import HomeContent2 from './homecomponents/homecontent2';
import Dashdonor from './homecomponents/dashdonor';

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeContent1 />
      <HomeContent2 />
      <Dashdonor />
    </>
  );
}
