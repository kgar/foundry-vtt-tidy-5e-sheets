worldThemes:
    type array of custom Theme objects
    world level
    config: false
    note: must be registered before colorScheme AND defaultTheme
    default: []

clientThemes:
    array of custom Theme objects
    client level
    config: false
    note: must be registered before colorScheme
    default: []

defaultTheme:
    string value -> the theme identifier
    world level
    choices: all registered theme IDs at world level
    show in config menu: yes
    config: true
    note: the default theme that new users will see; must have choices assembled after all world themes have been registered and made available
    default: light

colorScheme:
    string value -> the theme identifier
    client level
    options: default / ...all client- and world-level themes
    show in config menu: yes
    config: true
    note: the current theme; must have choices assembled after world and client themes have been registered and made available


After settings have loaded, determine the theme to apply:

'default' -> setting defaultTheme value -> reevaluate with this value
'light' -> default light theme
'dark' -> default dark theme
valid theme identifier -> the matching theme from client themes / world themes / default themes
else -> default light theme