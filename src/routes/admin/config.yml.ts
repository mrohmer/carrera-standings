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
              fields: [
                ...Object.entries(raceTypes)
                  .map(([name, label]) => ({
                    name,
                    label,
                    label_singular: 'Result',
                    collapsed: true,
                    widget: 'list',
                    default: racers.sort().map((racer) => ({racer})),
                    fields: [
                      {
                        name: 'racer',
                        label: 'Fahrer',
                        widget: 'select',
                        options: racers,
                      },
                      {
                        name: 'noParticipation',
                        label: 'Keine Teilnahme',
                        widget: 'boolean',
                        required: false,
                      },
                      name === 'mainRace' && {
                        name: 'penalty',
                        label: 'Strafpunkte',
                        widget: 'number',
                        required: false,
                        default: 0,
                        min: 0,
                        max: 100,
                      },
                    ].filter(i => !!i),
                  })),
                  {
                    name: 'fastestLap',
                    label: 'Schnellste Runde',
                    widget: 'select',
                    options: racers,
                    required: false,
                  },
                ],
            }
          ]
        }
      ],
      local_backend: getLocalBackend(),
    }
  }
};
