import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "../../user/schemas/user.schema";

@Schema({ timestamps: true })
export class Blog {
    @Prop({required: true})
    title: string;

    @Prop({required: true})
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User' })
    author?: User;

    @Prop({
      type: String,
      enum: ['technology', 'history', 'philosophy', 'psychology']
    })
    category: string;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    likes: User[];
}

export const BlogSchema = SchemaFactory.createForClass(Blog);