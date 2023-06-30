module.exports = {
  apps: [
    {
      /** General */
      /**
       * application name (default to script filename without extension)
       *
       * @type {string}
       * @example “my-api”
       */
      name: 'app',
      /**
       * script path relative to pm2 start
       *
       * @type {string}
       * @example “./api/app.js”
       */
      script: './dist/main.js',
      /**
       * the directory from which your app will be launched
       *
       * @type {string}
       * @example “/var/www/”
       */
      // cwd: '',
      /**
       * containing all arguments passed via CLI to script
       *
       * @type {string}
       * @example “-a 13 -b 12”
       */
      // args: '',
      /**
       * interpreter absolute path (default to node)
       *
       * @type {string}
       * @example "node"
       * @example “/usr/bin/python”
       */
      // interpreter: 'node',
      /**
       * option to pass to the interpreter
       *
       * @type {string | string[]}
       * @example “–harmony”
       */
      // interpreter_args: '--max-old-space-size=8192',
      /**
       * alias to interpreter_args
       *
       * @type {string | string[]}
       */
      node_args: ['--nouse-idle-notification', '--expose-gc', '--max-old-space-size=8192', '--stack_size=8192'],
      /** Advanced features */
      /**
       *  number of app instance to be launched
       *
       * @type {number}
       * @default 1
       * @example -1
       */
      instances: 0,
      /**
       * string	“cluster”	mode to start your app, can be “cluster” or “fork”, default fork
       * @type {"cluster"| "fork"}
       * @default "fork"
       */
      exec_mode: 'cluster',
      /**
       * enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded
       * @type {boolean | boolean[]} - boolean or array of string
       * @example true
       */
      // watch: true,
      /**
       * list of regex to ignore some file or folder names by the watch feature
       *
       * @type {string | string[]}
       */
      // ignore_watch: [],
      /**
       * your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be “10M”, “100K”, “2G” and so on…
       *
       *
       * @type {string}
       * @example “100M”
       * @example “1G”
       * @example “10M”
       */
      max_memory_restart: '1G',
      /**
       * inject when doing pm2 restart app.yml --env
       *
       * @type {object}
       * @example {“NODE_ENV”: “development”, “ID”: “42”}
       */
      env: {
        NODE_ENV: 'DEVELOPMENT',
        NODE_CONFIG_ENV: 'DEVELOPMENT',
      },
      /**
       * default to true, [enable/disable source map file]
       * @type {object}
       * @example {“NODE_ENV”: “production”, “ID”: “89”}
       */
      env_production: {
        NODE_ENV: 'PRODUCTION',
        NODE_CONFIG_ENV: 'PRODUCTION',
      },
      /**
       * default to true, [enable/disable source map file]
       *
       * @type {boolean}
       * @default true
       */
      // source_map_support: true,
      /**
       * @see https://pm2.keymetrics.io/docs/usage/environment/#specific-environment-variables
       * @type {string}
       * @example 'NODE_APP_INSTANCE'
       */
      // instance_var: 'NODE_APP_INSTANCE',
      /**
       * Excludes global variables starting with “REACT_” and will not allow their penetration into the cluster.
       *
       * @type {string[]}
       * @example ['REACT_']
       */
      // filter_env: ['NODE_ENV', 'NODE_CONFIG_ENV'],
      /** Log files */
      /**
       * log date format (see log section)
       *
       * @type {string}
       * @example “YYYY-MM-DD HH:mm Z”
       */
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      /**
       * error file path (default to $HOME/.pm2/logs/<app name>-error-<pid>.log)
       *
       * @type {string}
       */
      // error_file: './logs/error.log',
      /**
       * output file path (default to $HOME/.pm2/logs/<app name>-out-<pid>.log)
       *
       * @type {string}
       */
      // out_file: './logs/out.log',
      /**
       * file path for both output and error logs (disabled by default)
       *
       * @type {string}
       */
      // log_file: './logs/combined.log',
      /**
       * if set to true, avoid to suffix logs file with the process id
       *
       * @type {boolean}
       * @example true
       */
      // combine_logs: true,
      /**
       * alias to combine_logs
       *
       * @type {boolean}
       * @example true
       */
      // merge_logs: true,
      /**
       * false by default. If true auto prefixes logs with Date
       *
       * @type {boolean}
       * @default false
       */
      // time: true,
      /**
       * pid file path
       *
       * @type {string}
       * @default "$HOME/.pm2/pids/<app name>-<pid>.pid"
       */
      // pid_file: './logs/pid.log',
      /** Control flow */
      /**
       *  min uptime of the app to be considered started
       *
       * @type {number}
       * @example 1
       */
      // min_uptime: 1,
      /**
       * time in ms before forcing a reload if app not listening
       *
       * @type {number}
       * @example 8000
       */
      listen_timeout: 50000,
      /**
       * time in milliseconds before sending {a final SIGKILL}
       *
       * @see https://pm2.keymetrics.io/docs/usage/signals-clean-restart/#cleaning-states-and-jobs
       */
      kill_timeout: 5000,
      /**
       * shutdown an application with process.send(‘shutdown’) instead of process.kill(pid, SIGINT)
       *
       * @type {boolean}
       */
      // shutdown_with_message: false,
      /**
       * Instead of reload waiting for listen event, wait for process.send(‘ready’)
       *
       * @type {boolean}
       */
      wait_ready: true,
      /**
       * number of consecutive unstable restarts (less than 1sec interval or custom time via min_uptime) before your app is considered errored and stop being restarted
       *
       * @type {number}
       * @example 10
       */
      // max_restarts: 10,
      /**
       * time to wait before restarting a crashed app (in milliseconds). defaults to 0.
       *
       * @type {number}
       * @example 4000
       * @default 0
       */
      // restart_delay: 4000,
      /**
       * true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
       *
       * @type {boolean}
       * @default true
       */
      // autorestart: false,
      /**
       * a cron pattern to restart your app. Application must be running for cron feature to work
       *
       * @type {string}
       * @example '1 0 * * *'
       */
      // cron_restart: '1 0 * * *',
      /**
       * true by default. if false, PM2 will start without vizion features (versioning control metadata)
       *
       * @type {boolean}
       * @default true
       */
      // vizion: false,
      /**
       * a list of commands which will be executed after you perform a Pull/Upgrade operation from Keymetrics dashboard
       *
       * @type {string[]}
       * @example ['npm install', 'echo launching the app']
       */
      // post_update: ['npm install', 'echo launching the app'],
      /**
       * defaults to false. if true, you can start the same script several times which is usually not allowed by PM2
       *
       * @type {boolean}
       * @default false
       */
      // force: true,
      /** Deployment */
      /**
       * SSH key path	String
       *
       * @type {string}
       * @default '$HOME/.ssh'
       */
      // key: '$HOME/.ssh',
      /**
       * SSH user
       *
       * @type {string}
       */
      // user: '',
      /**
       * SSH host
       * @type {string}
       */
      // host: '',
      /**
       * SSH options with no command-line flag, see ‘man ssh’
       *
       * @type {string}
       */
      // ssh_options: '',
      /**
       * GIT remote/branch
       *
       * @type {string}
       */
      // ref: '',
      /**
       * GIT remote
       * @type {string}
       */
      // repo: "",
      /**
       * path in the server
       *
       * @type {string}
       */
      // path: '',
      /**
       * Pre-setup command or path to a script on your local machine
       *
       * @type {string}
       */
      // 'pre-setup': '',
      /**
       * Post-setup commands or path to a script on the host machine
       *
       * @type {string}
       */
      // 'post-setup': '',
      /**
       * pre-deploy action
       *
       * @type {string}
       */
      // 'pre-deploy-local': '',
      /**
       * 	post-deploy action
       *
       * @type {string}
       */
      // 'post-deploy': '',
    },
  ],
};
