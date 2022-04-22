import {readCupFiles} from '../../../lib/utils/read-cup-files';

export const get = () => {
  const cups = readCupFiles();

  return {
    body: cups
      .map(({title, slug}) => ({title, slug}))
  }
}
