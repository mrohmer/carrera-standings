import racers from '../../../content/racer.json';

const getLocalBackend = () => {
  if (!!process.env.PROD) {
    return undefined;
  }

  return {
    url: `http://localhost:8082/api/v1`
  }
}
export const get = () => {
  const raceTypes = {
    qualifying: 'Qualifying',
    timeTrial: 'Zeitfahren',
    mainRace: 'Hauptrennen',
  };

  return {
    body: {
      backend: {
        name: "github",
        repo: "mrohmer/carrera-standings",
        branch: "master"
      },
      media_folder: "static/uploads",
      collections: [
        {
          name: "cup",
          label: "Cup",
          folder: "content/cups",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{title}}",
          extension: 'json',
          editor: {
            preview: false,
          },
          fields: [
            {
              label: "Titel",
              name: "title"
            },
            {
              label: "Datum",
              name: "date",
              widget: "date"
            },
            {
              label: "Results",
              name: 'results',
              widget: 'object',
              collapsed: false,
              fields: Object.entries(raceTypes)
                .map(([name, label]) => ({
                  name,
                  label,
                  label_singular: 'Result',
                  collapsed: true,
                  widget: 'list',
                  fields: [
                    {
                      name: 'racer',
                      label: 'Fahrer',
                      widget: 'select',
                      options: racers,
                    },
                    {
                      name: 'time',
                      label: 'Zeit (in s)',
                      widget: 'string',
                      pattern: ['^(\\d{2}:){0,2}\\d{1,2}$', 'Muss im Format \'00:00:00\' sein.'],
                      required: false,
                    },
                    {
                      name: 'laps',
                      label: 'Runden',
                      widget: 'number',
                      min: 0,
                      max: 1000,
                      required: false,
                    },
                  ]
                }))
            }
          ]
        }
      ],
      local_backend: getLocalBackend(),
    }
  }
};
