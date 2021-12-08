import moment from "moment";

export const fromNowFilter = {
    filters: {
        fromNow(datetime) {
            return datetime ? moment(datetime).fromNow() : "-";
        },
    },
};

export const emptyImageFilter = {
    filters: {
        emptyImage(src) {
            return src || "https://i.ibb.co/hX5vD63/Rectangle-28.png";
        },
    },
};

export const emptyCoverFilter = {
    filters: {
        emptyCoverImage(src) {
            return src || "https://i.ibb.co/yyTyjTV/Cover-Photo.png";
        },
    },
};

export const tweetLengthFilter = {
    filters: {
        tweetLength(val) {
            if (val.length > 50) {
                return val.slice(0, 50) + "...";
            }
            return val;
        },
    },
};
export const nameLengthFilter = {
    filters: {
        nameLength(val) {
            if (val.length > 15) {
                return val.slice(0, 15) + "...";
            }
            return val;
        },
    },
};