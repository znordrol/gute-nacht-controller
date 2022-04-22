import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

import clsxm from '@/lib/clsxm';

export type ParticleProps = {
  particleClassName?: string;
} & React.ComponentPropsWithoutRef<'div'>;

const ParticleComponent = ({
  className,
  particleClassName,
  ...rest
}: ParticleProps) => {
  const particlesInit = async (main: Engine) => {
    await loadFull(main);
  };

  return (
    <div className={clsxm('bg-black', className)} {...rest}>
      <Particles
        id='tsparticles'
        className={clsxm('h-full w-full', particleClassName)}
        init={particlesInit}
        options={{
          background: {
            color: {
              value: 'transparent',
            },
          },
          fpsLimit: 60,
          interactivity: {
            detectsOn: 'canvas',
            events: {
              onClick: {
                enable: true,
                mode: 'repulse',
              },
              onHover: {
                enable: true,
                mode: 'grab',
                parallax: {
                  enable: true,
                  force: 15,
                  smooth: 10,
                },
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              grab: {
                links: {
                  blink: true,
                  color: '#800000',
                  consent: true,
                  opacity: 1,
                },
                distance: 169,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#ff4655',
            },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: false,
            },
            move: {
              direction: 'none',
              enable: true,
              outMode: 'bounce',
              random: false,
              speed: 3,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 30,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'triangle',
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
};

export default ParticleComponent;
