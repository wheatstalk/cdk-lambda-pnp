"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.muglify = void 0;
const uglify_js_1 = __importDefault(require("uglify-js"));
function muglify(code) {
    return uglify_js_1.default.minify(code) + ' // MUGLIFIED';
}
exports.muglify = muglify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSwwREFBK0I7QUFFL0IsU0FBZ0IsT0FBTyxDQUFDLElBQVk7SUFDbEMsT0FBTyxtQkFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxlQUFlLENBQUM7QUFDL0MsQ0FBQztBQUZELDBCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHVnbGlmeSBmcm9tICd1Z2xpZnktanMnO1xuXG5leHBvcnQgZnVuY3Rpb24gbXVnbGlmeShjb2RlOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gdWdsaWZ5Lm1pbmlmeShjb2RlKSArICcgLy8gTVVHTElGSUVEJztcbn0iXX0=