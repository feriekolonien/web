const Question = ({ children }) => {
  return (
    <summary className="f3" style={{ cursor: "pointer" }}>
      {children}
    </summary>
  );
};

const FAQElement = ({ children }) => {
  return <details className="f4 fw3 mb3 lh-copy">{children}</details>;
};

const FAQ = ({ children }) => {
  return (
    <>
      <FAQElement>
        <Question>Feriekoloni, hva er det?</Question>
        <p>
          Feriekolonien på Filtvet eies av Trefoldighetslegatet. Driften har i
          alle år vært ivaretatt av Trefoldighet Menighet (Trefoldighetskirken)
          som ligger i Oslo sentrum og som nå er en del av Sentrum og St.
          Hanshaugen sokn.
        </p>

        <p>
          Trefoldighet feriekoloni har som mål å gi barn en morsom og
          innholdsrik ferie.
        </p>

        <p>
          I over 125 år har barn og unge vært på sommerferie hos oss. I år kan
          du også få være med. Trefoldighet feriekoloni ligger på Filtvet på
          Hurumlandet, ca. 1 times bilkjøring fra Oslo. Hurumlandet er et
          spennende sted med forskjellig natur. Nede ved sjøen er det
          «sørlandsidyll» med strender og svaberg, og ikke langt unna er det
          fine skogsterreng med store vann. Det gir muligheter for mange fine
          aktiviteter.
        </p>
      </FAQElement>

      <FAQElement>
        <Question>Hvem kommer til oss?</Question>
        <p>
          Alle gutter og jenter i alderen 5-12 år kan søke om plass på
          feriekolonien. Her vil man treffe nye venner eller kanskje noen man
          kjenner fra før. Noen reiser på feriekoloni sammen med en venn eller
          søsken, mens andre reiser alene. Uansett, feriekolonien tar godt vare
          på alle sammen.
        </p>
      </FAQElement>

      <FAQElement>
        <Question>Hva skal man ha med seg?</Question>
        <p>I løpet av 11 raske dager tar du kun med deg det du trenger.</p>
        <p>
          Feriekolonien har mye fine og rene klær i alle størrelser som barna
          låner når de er her ute, så mye tøy behøver du ikke. Det man MÅ ta med
          seg er: regntøy/gummistøvler, joggesko, toalettsaker (tannbørste,
          tannkrem, såpe, shampo, kam/børste, solkrem med solfaktor) kosedyr
          hvis man vil, og litt lommepenger til kiosken som er åpen to ganger i
          uka. Ønsker du likevel å ta med noe eget tøy, er det viktig at de er
          godt merket med navn, og at man passer på tingene sine. Mobiltelefon
          ønsker vi ikke at barna har med.
        </p>
      </FAQElement>

      <FAQElement>
        <Question>Vi som jobber her</Question>
        <p>
          Hver sommer er det 50 barn på feriekolonien av gangen i 3 x 11 dager.
        </p>
        <p>
          Sammen med barna er vi 15-20 voksne som passer på. Mange av oss jobber
          med barn og ungdom resten av året eller så har de vært barn på
          feriekolonien selv. Som så mange av barna, er også betjeningen på
          feriekolonien ganske stabil fra år til år. Dette er med på å skape et
          trygt miljø for både barn og voksne. Det viktigste med å være en av de
          voksne på feriekolonien er å være en god venn, en lekekamerat,
          samtidig som man passer godt på – alle som èn.
        </p>
      </FAQElement>

      <FAQElement>
        <Question>Sikkerhet er veldig viktig for oss!</Question>
        <p>
          Vi har årlig kursing i førstehjelp og brannvern med våre ansatte. På
          turer på vann og land er vi alltid påpasselige med å bruke
          redningsvest og sykkelhjelm – store og små.
        </p>
      </FAQElement>

      <FAQElement>
        <Question>Telefon og post</Question>
        <p>
          Det er hyggelig og viktig å få post hjemmefra når man er på
          feriekoloni. Send veldig gjerne kort, pakke, et blad eller to, men
          ikke så mye godteri, for dette kjøper barna selv i kiosken, i tillegg
          til at vi har dessert til middagen hver dag.
        </p>

        <p>
          Det at foresatte ønsker å snakke med barna skjønner vi svært godt, men
          det blir problematisk for oss dersom 20-30-40 barn hver dag må hentes
          inn fra lek eller aktiviteter for å snakke i telefonen. Det er bare
          hyggelig med telefoner, så ring gjerne hver dag og snakk med en av oss
          som jobber her. Vi kjenner barnet ditt godt og kan formidle alle
          beskjeder. Dersom et barn ikke skulle slå seg til ro etter et par
          dager og ha hjemlengsel, er vi raske med å ringe hjem og si ifra om
          dette. Det samme gjelder hvis noen blir syke. Som regel er det da
          greiest at barna drar hjem og er der til de er friske, og etter det
          kan fortsette ferien med oss på Filtvet.
        </p>
      </FAQElement>
    </>
  );
};

export default FAQ;