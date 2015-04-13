var styles = {
    topmenu: {
        backgroundColor: '#2964a8',
        position: 'fixed',
        top: '0',
        left: '0',
        height: '100%',
        width: '100%',
    },
    main: {
        backgroundColor: '#b49755',
        position: 'absolute',
        top: '30px',
        left: '0',
        height: '100%',
        width: '100%',
    },
    dataview: {
        backgroundColor: '#b49755',
        position: 'fixed',
        top: '30px',
        left: '0',
        height: '100%',
        width: '100%',
    },
    datatext: {
        position: 'relative',
        top: '50px',
        left: '10px',
    },
    datainfobox: {
        position: 'fixed',
        top: '50px',
        left: '350px',
    },
    matchblock: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#666666',
        height: '100px',
        width: '100px',
        border: '1px solid black',
    },
    chromoselect: {
        position: 'fixed',
        top: '0px',
        left: ' 240px',
    },
    displayselect: {
        position: 'fixed',
        top: '0px',
        left: '300px',
    },
    matchinfo: {
        position: 'absolute',
        top: '600px',
        left: '20px',
    },
}

function matchstyle(xpos, ypos, rectHeight, rectWidth) {
    var matchblockStyle = {
            position: 'absolute',
            top: ypos,
            left: xpos,
            backgroundColor: '#FFBF5E',
            height: rectHeight,
            width: rectWidth,
            border: '1px solid black',
            borderRadius: '5px',
            overflow: 'hidden',
            padding: '0px',
            margin: '0px',
            fontFamily: '"Arial"',
            fontSize: 'small',
            userSelect: 'none',
        };
    return matchblockStyle;
}

function chromostyle(xpos, ypos, rectHeight, rectWidth, fSize) {
    var chromostyle = {
            position: 'absolute',
            top: ypos,
            left: xpos,
            backgroundColor: '#006666',
            height: rectHeight,
            width: rectWidth,
            borderRadius: '10px',
            padding: '0px',
            margin: '0px',
            color: '#007777',
            fontFamily: '"Arial"',
            fontSize: fSize,
            overflow: 'hidden',
        };
    return chromostyle;
}
    