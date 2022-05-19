export class MapModel {
    // Point style used in map
    public static PointPaintStyle: any = {
        'circle-radius': 10,
        'circle-color': '#ff2218',
        'circle-opacity': 0.75,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#3E0000',
    };

    // PA Counties
    public static FillCountyPaintStyle: any = {
        'fill-color': 'rgba(178, 178, 178, 1)',
        'fill-outline-color': 'rgba(0, 0, 0, 1)'
    }

    // Regions
    public static FillRegionPaintStyle: any = {
        'fill-color': 'rgba(0, 92, 230, 0.4)',
        'fill-outline-color': 'rgba(0, 92, 230, 1)'
    }
    public static LineRegionPaintStyle: any = {
        'line-color': '#005CE6',
        'line-width': 2
    }

    // State Forest
    public static FillStateForestPaintStyle: any = {
        'fill-color': 'rgba(76, 115, 0, 1)',
        'fill-outline-color': 'rgba(76, 115, 0, 1)'
    }

    // State Park
    public static FillStateParkPaintStyle: any = {
        'fill-color': 'rgba(112, 168, 0, 1)',
        'fill-outline-color': 'rgba(112, 168, 0, 1)'
    }

    // SGL
    public static FillSGLPaintStyle: any = {
        'fill-color': 'rgba(255, 212, 97, 1)',
        'fill-outline-color': 'rgba(255, 212, 97, 1)'
    }

    // Roads
    public static LineRoadsPaintStyle: any = {
        'line-color': '#000',
        'line-width': 2
    }
}