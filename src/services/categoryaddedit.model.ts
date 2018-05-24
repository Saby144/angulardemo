export class Category{
    CategoryId: number;
    CategoryName: string;
    SequenceNo: number;
    Description: string;
    Image: string;
}

export class CategoryModel {
    constructor(public CategoryId?: number,
                public CategoryName?: string,
                public SequenceNo?: number,
                public Description?: string,
                public Image?: string,
    ){}
}
