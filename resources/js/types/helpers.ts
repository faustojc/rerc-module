import { BlockNoteSchema, defaultBlockSpecs, defaultInlineContentSpecs, defaultStyleSpecs } from "@blocknote/core";

export const statusColor = (status: string) => {
    if ('pending'.includes(status.toLowerCase())) {
        return "warning";
    } else if ('approved,completed,submitted,done,assigned,signed'.includes(status.toLowerCase())) {
        return "success";
    } else if ('sent,received,reviewed,reviewing,uploaded'.includes(status.toLowerCase())) {
        return "secondary";
    } else if ('rejected,removed'.includes(status.toLowerCase())) {
        return "danger";
    } else {
        return "primary";
    }
};

export const blockNoteSchema = () => {
    let editedSchema: any =  {}
    const unwantedBlocks = ['audio', 'image', 'file', 'video', 'codeBlock'];

    Object.entries(defaultBlockSpecs).forEach(([blockName, blockSchema])=>{
        if(!unwantedBlocks.includes(blockName)) {
            editedSchema[blockName] = blockSchema
        }
    });

    return BlockNoteSchema.create({
        blockSpecs: {...editedSchema},
        inlineContentSpecs: {...defaultInlineContentSpecs},
        styleSpecs: {...defaultStyleSpecs,}
    });
}
