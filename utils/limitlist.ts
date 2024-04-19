
const listing: string[] =[];
export default (list: any, limit: number = 3) => {
        for(let i=0; i<limit; i++){
            listing.push(list[i]);
        }
    return listing;   
}