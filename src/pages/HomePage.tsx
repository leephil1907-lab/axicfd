import Hero from "../sections/Hero";
import StatsBar from "../sections/StatsBar";
import Advantages from "../sections/Advantages";
import Platform from "../sections/Platform";
import Markets from "../sections/Markets";
import AssetCategories from "../sections/AssetCategories";
import Education from "../sections/Education";
import Awards from "../sections/Awards";
import ManCityPartnership from "../sections/ManCityPartnership";
import Trustpilot from "../sections/Trustpilot";
import AxiBlog from "../sections/AxiBlog";
import CountrySelector from "../sections/CountrySelector";
import CTABanner from "../sections/CTABanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <Advantages />
      <Platform />
      <Markets />
      <AssetCategories />
      <Education />
      <Awards />
      <ManCityPartnership />
      <Trustpilot />
      <AxiBlog />
      <CountrySelector />
      <CTABanner />
    </>
  );
}
