// TODO(teawithsand): implement nice matrix util
export class Matrix {
	private data: number[]
	constructor(w: number, h: number) {
		this.data = []
		for (let i = 0; i < w * h; i++) {
			this.data.push(0)
		}
	}
}
