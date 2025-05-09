const { Command } = require('commander');

// #region command tree + parsing
const commandTree = {
    test: {
        rename: {
            '<name>': (name) => console.log(`hi there, ${name}`),
        },
        combat_init: {
            alone: () => console.log('alone')
            ,
            party: () => console.log('alone')
        }
    }
};

const descriptions = {
    main: 'Main command',
    test: 'Test command help',
    rename: 'Rename something',
    '<name>': 'Name argument help',
    combat_init: 'Combat setup',
    alone: 'Alone mode',
    party: 'Party mode'
};

function buildCommands(name, tree, descriptions = {}) {
    const cmd = new Command(name);
    if (descriptions[name]) cmd.description(descriptions[name]);

    for (const key in tree) {
        const val = tree[key];

        if (typeof val === 'function') {
            cmd.command(key)
                .description(descriptions[key] || '') // custom help
                .action(val);
        } else {
            const subKeys = Object.keys(val);
            const isArgCommand = subKeys.length === 1 && (subKeys[0].startsWith('<') || subKeys[0].startsWith('['));
            if (isArgCommand) {
                const [arg] = subKeys;
                const fn = val[arg];
                const subCmd = new Command(key);
                if (descriptions[key]) subCmd.description(descriptions[key]);
                subCmd.argument(arg).action(fn);
                cmd.addCommand(subCmd);
            } else {
                const subCmd = buildCommands(key, val, descriptions);
                cmd.addCommand(subCmd);
            }
        }
    }

    return cmd;
}

const program = buildCommands('main', commandTree, descriptions);


program.helpInformation = () => {
    return 'Custom help message goes here';
};

program.commands.find(cmd => cmd.name() === 'test').helpInformation = () => {
    return 'this is help message for test';
};

let x = "test rename elliot"
x = x.split(" ")
x.unshift(null, null);

program.parse(x);
// #endregion