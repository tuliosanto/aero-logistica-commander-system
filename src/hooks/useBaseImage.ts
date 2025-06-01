
import { useMemo } from 'react';

// Import all base images
import baafImage from '../images/bases/baaf.png';
import baanImage from '../images/bases/baan.png';
import babeImage from '../images/bases/babe.png';
import babrImage from '../images/bases/babr.png';
import babvImage from '../images/bases/babv.png';
import bacgImage from '../images/bases/bacg.png';
import bacoImage from '../images/bases/baco.png';
import baflImage from '../images/bases/bafl.png';
import bafzImage from '../images/bases/bafz.png';
import baglImage from '../images/bases/bagl.png';
import bamnImage from '../images/bases/bamn.png';
import bantImage from '../images/bases/bant.png';
import bapvImage from '../images/bases/bapv.png';
import barfImage from '../images/bases/barf.png';
import bascImage from '../images/bases/basc.png';
import basmImage from '../images/bases/basm.png';
import baspImage from '../images/bases/basp.png';
import bastImage from '../images/bases/bast.png';
import basvImage from '../images/bases/basv.png';

const baseImages: Record<string, string> = {
  'BAAF': baafImage,
  'BAAN': baanImage,
  'BABE': babeImage,
  'BABR': babrImage,
  'BABV': babvImage,
  'BACG': bacgImage,
  'BACO': bacoImage,
  'BAFL': baflImage,
  'BAFZ': bafzImage,
  'BAGL': baglImage,
  'BAMN': bamnImage,
  'BANT': bantImage,
  'BAPV': bapvImage,
  'BARF': barfImage,
  'BASC': bascImage,
  'BASM': basmImage,
  'BASP': baspImage,
  'BAST': bastImage,
  'BASV': basvImage,
};

export const useBaseImage = (baseCode: string) => {
  return useMemo(() => {
    return baseImages[baseCode] || basmImage; // fallback to BASM image
  }, [baseCode]);
};
