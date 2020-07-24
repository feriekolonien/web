import Page from '../components/Page';
import { PageContent } from '../components/PageContent';
import WaveDivider from '../components/WaveDivider';
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';
import LandingPageVideo from '../components/LandingPageVideo';
import FAQ from '../components/FAQ';

import colors from '../styles/colors';

function HomePage() {
  return (
    <Page style={{ backgroundColor: colors.primary }}>
      <Navigation />
      <div className="mt4 mt5-m mt4-l ph3 mw8 center flex flex-column-reverse flex-row-ns">
        <div className="w-100 tc mb4">
          <img
            className="db-ns w5 w-auto-ns"
            src="/static/img/logo.png"
            alt="Kolomåke"
          />
        </div>

        <div className="ml4-l tc-ns">
          <style jsx>{`
            * {
              color: ${colors.darkBlue};
            }

            p,
            ul > li {
              line-height: 1.5;
            }
          `}</style>
          <h1 className="mb0 lh-title f1-ns">
            Sommerferie på Filtvet Feriekoloni
          </h1>
          <div className="fw1 f4 white-80 mt3 mb4 lh-title">
            <p>
              Trefoldighet Feriekoloni er norges eldste aktive feriekoloni –
              eller sommerleir om du vil!
            </p>
            <p>
              I over 125 år har barn og unge vært på ferie hos oss. Kanskje du
              også vil komme til sommeren?{' '}
            </p>
          </div>
          <LandingPageVideo />
        </div>
      </div>
      <WaveDivider color={colors.primary} />
      <PageContent bgColor={colors.primary} color="white">
        <div>
          <h3 className="f2 mt0">Ofte stilte spørsmål</h3>
          <FAQ />
        </div>
      </PageContent>
      <Footer bgColor={colors.primary} color="white" />
    </Page>
  );
}

export default HomePage;
