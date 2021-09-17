import {
  MAP_CATALOG_CLOSE,
  MAP_CATALOG_OPEN,
  SELECTED_ITEM,
  REFRESH_LAYERS_FOR_PDFS,
  ADD_PDF,
  SELECT_PDF,
  REMOVE_PDF,
} from "../actions/types";

export const map_catalog = (state, action) => {
  if (state === undefined) {
    state = {
      is_open: true,
      selected_item: "Layer1",
      selected_pdf: "",
      pdfs: [
        {
          layer_name: "Layer1",
          active: false,
          pdfs: ["One.pdf", "Two.pdf", "Three.pdf"],
        },
        {
          layer_name: "Layer2",
          active: false,
          pdfs: ["Four.pdf", "Five.pdf", "Seven.pdf"],
        },
        {
          layer_name: "Layer3",
          active: false,
          pdfs: ["Seven.pdf", "Eight.pdf", "Nine.pdf"],
        },
        {
          layer_name: "GISWEB1.Parks.Maps and Brochures",
          active: false,
          pdfs: ["Ten.pdf", "Eleven.pdf", "Twelve.pdf"],
        },
        {
          layer_name: "Iraq.ONC",
          active: false,
          pdfs: ["Ten.pdf", "Eleven.pdf", "Twelve.pdf"],
        },
        {
          layer_name: "Iraq.TPC",
          active: false,
          pdfs: ["Ten.pdf", "Eleven.pdf", "Twelve.pdf"],
        },
        {
          layer_name: "District_of_Columbia",
          active: false,
          pdfs: ["Ten.pdf", "Eleven.pdf", "Twelve.pdf"],
        },
        {
          layer_name: "Ortho",
          active: false,
          pdfs: ["Sixteen.pdf", "Seventeen.pdf", "Eighteen.pdf"],
        },
        {
          layer_name: "Utah",
          active: false,
          pdfs: ["Thirteen.pdf", "Fourteen.pdf", "Fifteen.pdf"],
        },
      ],
    };
  }
  switch (action.type) {
    case REFRESH_LAYERS_FOR_PDFS:
      {
        const layers = state.pdfs;
        const selected = state.selected_item;
        layers.forEach((element) => {
          if (selected == element.layer_name) {
            element.active = true;
          } else {
            element.active = false;
          }
        });
      }
      break;

    case MAP_CATALOG_OPEN:
      {
        state = Object.assign({}, state, { is_open: true });
      }
      break;

    case MAP_CATALOG_CLOSE:
      {
        state = Object.assign({}, state, { is_open: false });
      }
      break;

    case SELECTED_ITEM:
      {
        state = Object.assign({}, state, { selected_item: action.payload });
      }
      break;

    case ADD_PDF:
      {
        const theState = Object.assign({}, state);
        function theLayer(element) {
          return element.layer_name == action.payload;
        }
        const clickedPdf = theState.pdfs.findIndex(theLayer);
        const newPDFS = theState.pdfs[clickedPdf].pdfs;
        newPDFS.push(action.payload2);
        theState.pdfs[clickedPdf].pdfs = newPDFS;

        state = Object.assign({}, state, { pdfs: [...theState.pdfs] });
      }
      break;

    case SELECT_PDF:
      {
        state = Object.assign({}, state, { selected_pdf: action.payload });
      }
      break;

    case REMOVE_PDF:
      {
        const theState = Object.assign({}, state);
        function theLayer(element) {
          return element.layer_name == action.payload;
        }
        const clickedPdf = theState.pdfs.findIndex(theLayer);
        const newPDFS = theState.pdfs[clickedPdf].pdfs;
        const pdfIndex = newPDFS.indexOf(action.payload2);
        newPDFS.splice(pdfIndex, 1);
        theState.pdfs[clickedPdf].pdfs = newPDFS;

        state = Object.assign({}, state, { pdfs: [...theState.pdfs] });
      }
      break;

    default:
      break;
  }

  return state;
};
