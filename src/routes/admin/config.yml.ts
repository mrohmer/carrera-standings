import racers from '../../../content/racer.json';
import type {RequestHandler} from '@sveltejs/kit';

const getLocalBackend = () => {
  if (!!process.env.PROD) {
    return undefined;
  }

  return {
    url: `http://localhost:8082/api/v1`
  }
}

export const get: RequestHandler = ({url}) => {
  const raceTypes = {
    timeTrial: 'Zeitfahren',
    mainRace: 'Hauptrennen',
  };

  const racerSelect = {
    name: 'racer',
    label: 'Fahrer',
    widget: 'select',
    options: Object.keys(racers),
  };

  return {
    body: {
      backend: {
        name: "github",
        repo: "mrohmer/carrera-standings",
        branch: "master",

        commit_messages: {
          create: 'content({{collection}}): created {{slug}}',
          update: 'content({{collection}}): updated {{slug}}',
          delete: 'content({{collection}}): deleted {{slug}}',
          uploadMedia: 'content(media): uploaded {{path}}',
          deleteMedia: 'content(media): deleted {{path}}',
          openAuthoring: 'content: {{message}}',
        }
      },
      media_folder: "static/uploads",
      public_folder: '/uploads',
      collections: [
        {
          name: "cup",
          label: "Cup",
          folder: "content/cups",
          create: true,
          slug: "{{year}}-{{month}}-{{day}}-{{title}}",
          summary: '{{title}} ({{day}}.{{month}}.{{year}})',
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
              label: 'Streckenlayout',
              name: 'layout',
              widget: 'image',
              required: false,
              allow_multiple: false,
              choose_url: false,
            },
            {
              name: 'info',
              label: 'Info',
              widget: 'object',
              collapsed: true,
              fields: [
                {
                  label: 'Streckenlänge',
                  name: 'trackLength',
                  required: false,
                  widget: 'number',
                  min: 0,
                  value_type: 'int',
                },
                {
                  label: 'Länge Box',
                  name: 'pitLaneLength',
                  required: false,
                  widget: 'number',
                  min: 0,
                  value_type: 'int',
                },
                {
                  label: 'Bahnrekord',
                  name: 'record',
                  widget: 'object',
                  collapsed: true,
                  summary: '{{fields.time}}s {{fields.racer}}',
                  fields: [
                    {
                      ...racerSelect,
                      required: false,
                    },
                    {
                      name: 'time',
                      label: 'Rundenzeit',
                      widget: 'number',
                      required: false,
                      min: 0,
                      max: 100,
                      value_type: 'float',
                    },
                    {
                      name: 'date',
                      label: 'Zeitpunkt',
                      widget: 'date',
                      required: false,
                    }
                  ]
                }
              ]
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
                    default: Object.keys(racers).sort().map((racer) => ({racer})),
                    fields: [
                      racerSelect,
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
                      name === 'timeTrial' && {
                        name: 'rounds',
                        label: 'Runden',
                        widget: 'number',
                        required: false,
                        min: 0,
                        max: 500,
                      },
                      name === 'timeTrial' && {
                        name: 'fastestLapTime',
                        label: 'Schnellste Rundenzeit',
                        widget: 'number',
                        required: false,
                        min: 0,
                        max: 100,
                        value_type: 'float',
                      }
                    ].filter(i => !!i),
                  })),
                {
                  ...racerSelect,
                  name: 'fastestLap',
                  label: 'Schnellste Runde',
                  required: false,
                },
              ],
            },
          ]
        }
      ],
      local_backend: getLocalBackend(),
      display_url: `${url.protocol}//${url.host}`,
      locale: 'de',
    }
  }
};
