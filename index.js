import path from 'node:path';
import { glob } from 'glob';

const filter = /\*/;
const namespace = 'plugin-glob-imports';

export default function globImport() {

	return {
		name: namespace,
		setup( build ) {
			build.onResolve( { filter }, ( args ) => resolve( args, build ) );
			build.onLoad( {
				filter,
				namespace,
			}, args => load( args ) );
		},
	};
}

function resolve( args, build ) {
	const cwd = process.cwd().endsWith( '/' ) ? process.cwd() : process.cwd() + '/';
	const resolvePaths = [];
	const files = [];
	if ( build && build.initialOptions && build.initialOptions.nodePaths && build.initialOptions.nodePaths.length ) {
		build.initialOptions.nodePaths.forEach( path => {
			resolvePaths.push( cwd + path + args.path );
		} );
	} else {
		resolvePaths.push( args.resolveDir );
	}
	resolvePaths.forEach( loadpath => {
		const tmpFiles = glob.sync(
			path.normalize( loadpath ),
			{ windowsPathsNoEscape: true } );
		if ( tmpFiles.length ) {
			tmpFiles.forEach( tmpFile => {
				files.push( path.relative( cwd, tmpFile ).replaceAll( '\\', '/' ) );
			} );
		}
	} );

	return {
		namespace,
		path: args.path,
		pluginData: {
			resolveDir: cwd,
			files: files,
		},
	};
}

function load( args ) {
	const pluginData = args.pluginData;
	const paths = pluginData.files;

	const data = [];
	const obj = {};

	for ( let i = 0; i < paths.length; i++ ) {
		const filepath = paths[ i ];
		const arr = filepath.split( '/' );
		const name = '_module' + i;

		arr.shift();

		let prev = obj;

		for ( let i = 0; i < arr.length; i++ ) {
			let key = arr[ i ];

			if ( typeof prev === 'string' ) {
				continue;
			}

			if ( i === arr.length - 1 ) {
				data.push( `import ${ prev[ key ] = name } from './${ filepath }'` );
				continue;
			}

			prev = prev[ key ] ??= {};
		}
	}

	let output = JSON.stringify( obj );
	output = output.replace( /"_module\d+"/g, match => match.slice( 1, -1 ) );

	return {
		resolveDir: pluginData.resolveDir,
		contents: data.join( '\n' ) + '\nexport default ' + output,
	};
}
