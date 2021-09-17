export default function getPDFS(PDFS, newllPoint) {
  const LayerOne = PDFS.getElementsByTagName("Layer")[0];
  const LayerTwo = PDFS.getElementsByTagName("Layer")[1];
  const LayerThree = PDFS.getElementsByTagName("Layer")[2];
  const LayerFour = PDFS.getElementsByTagName("Layer")[3];
  const LayerFive = PDFS.getElementsByTagName("Layer")[4];
  const LayerSix = PDFS.getElementsByTagName("Layer")[5];

  let pdfsWithBoundsForThatPDF = [
    {
      name: LayerOne.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerOne.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerOne.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerOne.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerOne.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
    {
      name: LayerTwo.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerTwo.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerTwo.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerTwo.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerTwo.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
    {
      name: LayerThree.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerThree.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerThree.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerThree.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerThree.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
    {
      name: LayerFour.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerFour.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerFour.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerFour.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerFour.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
    {
      name: LayerFive.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerFive.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerFive.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerFive.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerFive.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
    {
      name: LayerSix.getElementsByTagName("Name")[0].innerHTML,
      bounds: {
        minx: LayerSix.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("minx"),
        miny: LayerSix.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("miny"),
        maxx: LayerSix.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxx"),
        maxy: LayerSix.getElementsByTagName(
          "LatLonBoundingBox"
        )[0].getAttribute("maxy"),
      },
    },
  ];

  if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[0].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[0].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[0].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[0].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[0].name;
  } else if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[1].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[1].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[1].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[1].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[1].name;
  } else if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[2].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[2].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[2].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[2].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[2].name;
  } else if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[3].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[3].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[3].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[3].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[3].name;
  } else if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[4].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[4].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[4].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[4].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[4].name;
  } else if (
    newllPoint[0] > pdfsWithBoundsForThatPDF[5].bounds.minx &&
    newllPoint[0] < pdfsWithBoundsForThatPDF[5].bounds.maxx &&
    newllPoint[1] > pdfsWithBoundsForThatPDF[5].bounds.miny &&
    newllPoint[1] < pdfsWithBoundsForThatPDF[5].bounds.maxy
  ) {
    return pdfsWithBoundsForThatPDF[5].name;
  }
}
