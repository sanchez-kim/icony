import { Composition } from 'remotion';
import { Promo, PROMO_DURATION } from './promo/Promo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="IconyPromo"
        component={Promo}
        durationInFrames={PROMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
