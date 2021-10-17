import '@vime/core/themes/light.css';
import React, { useState } from 'react';
// import YouTube from 'react-youtube';
import { DefaultUi, Player, Ui, Video } from '@vime/react';
import PromoImage from './PromoImage';

const LandingPageVideo = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <Player>
      {/* Provider component is placed here. */}
      <Video crossOrigin="" poster="/static/poster.jpg">
        {/* These are passed directly to the underlying HTML5 `<video>` element. */}
        {/* Why `data-src`? Lazy loading, you can always use `src` if you prefer.  */}
        <source data-src="https://media.vimejs.com/720p.mp4" type="video/mp4" />
      </Video>
      <DefaultUi noSettings>
        {/* We can place our own UI components here to extend the default UI. */}
      </DefaultUi>
      {/* <Ui>UI components are placed here.</Ui> */}
    </Player>
  );

  // if (openModal) {
  //   return (
  //     <div className="flex justify-center">
  //       <YouTube
  //         videoId="UzQcTkygO8Q"
  //         opts={{
  //           height: 225,
  //           width: 400,
  //           playerVars: {
  //             autoplay: 1,
  //           },
  //         }}
  //       />
  //     </div>
  //   );
  // }

  // return (
  //   <div>
  //     <PromoImage
  //       className="mb4"
  //       src="/static/poster.jpg"
  //       onClick={() => setOpenModal(true)}
  //     />
  //   </div>
  // );
};

export default LandingPageVideo;
